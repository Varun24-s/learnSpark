# LearnSpark Precise User Flow

This document provides a high-fidelity mapping of the LearnSpark platform's logic, from initial role selection to secure learning sessions and data persistence.

```mermaid
graph TD
    %% Entry & Identity
    Start([Application Start]) --> Landing[Landing Page]
    Landing --> AuthChoice{Action?}
    
    AuthChoice -- Join --> RoleSelect[Role Selection]
    AuthChoice -- Login --> SignIn[Sign In Page]

    %% Registration Architecture
    subgraph Registration Workflow
        RoleSelect --> RoleType{Select Identity}
        RoleType -- "Little Explorer" --> ChildReg[/sign-up/child/]
        RoleType -- "Parent / Guardian" --> ParentReg[/sign-up/parent/]
        
        ChildReg --> SubmitChild[Submit: Username, Email, Password]
        ParentReg --> SubmitParent[Submit: Username, Email, Password + Optional Link Child]
        
        SubmitParent --> ChildVal{Child Exists?}
        ChildVal -- No --> LinkLate[Warn: Link Later in Dashboard]
        ChildVal -- Yes --> CreateLink[Create parent_child_links]
        
        SubmitChild --> VerifyEmail[Redirect: Email Verification Prompt]
        LinkLate --> VerifyEmail
        CreateLink --> VerifyEmail
    end

    %% Authentication & Security Logic
    subgraph Secure Ingress
        SignIn --> Input[Enter Email & Password]
        Input --> IngressType{Credentials?}
        
        %% Admin Bypass
        IngressType -- "Match ENV_VARS" --> AdminSession[Set admin_session Cookie]
        AdminSession --> AdminDash[/dashboard/admin/]
        
        %% Standard User
        IngressType -- "Match Supabase" --> MFACheck{MFA Enrolled?}
        
        MFACheck -- Yes --> ChallengeMFA[/verify-2fa/]
        ChallengeMFA --> VerifyOTP[OTP Challenge Response]
        VerifyOTP --> RoleMux{Identity Mux}
        
        MFACheck -- No --> RoleMux
    end

    %% Persistent Dashboards
    subgraph Dashboard Ecosystem
        RoleMux -- CHILD --> ChildDash[/dashboard/child/]
        RoleMux -- PARENT --> ParentDash[/dashboard/parent/]
        
        %% Parent Features
        ParentDash --> SecHub[Security Hub: /mfa-enroll]
        ParentDash --> LinkFlow[/dashboard/parent/link-child/]
        ParentDash --> ProxyMode[Click Child Profile]
        ProxyMode -- "Proxy=ID" --> ChildDash
    end

    %% The Learning Cycle
    subgraph Learning Loop
        ChildDash --> CatSelect[Select Category: Numbers / Shapes]
        CatSelect --> ModList[Module List]
        ModList --> ModIntro[Module Intro: SVG + TTS Description]
        ModIntro --> PlayTrigger[User Clicks 'Let's Play!']
        
        PlayTrigger --> ModExercise[Module Exercise]
        ModExercise -- Tap --> TapLoop[Tap Counter Interaction]
        ModExercise -- Find --> SearchLoop[Find Shape Interaction]
        
        TapLoop --> SuccessCheck{Correct?}
        SearchLoop --> SuccessCheck
        
        SuccessCheck -- Yes --> Reward[Reward: Star Shower + Haptics]
        Reward --> DBProgress[Upsert: progress table]
        DBProgress --> NextMod{Next Rocket?}
        
        NextMod -- Yes --> ModIntro
        NextMod -- No --> ChildDash
    end

    %% Global Middleware
    subgraph Middleware Enforcement
        Request[Every Request] --> SessionCheck{Session Active?}
        SessionCheck -- No --> AuthState{Target Route?}
        AuthState -- Protected --> RedirectLogin[Redirect to /sign-in]
        AuthState -- Public --> Allow[Allow Access]
        
        SessionCheck -- Yes --> RoleGate{Proper Role?}
        RoleGate -- No --> DashboardRedir[Redirect to /dashboard]
        RoleGate -- Yes --> Allow
    end

    %% Styling
    style Start fill:#f9f,stroke:#333
    style ChildDash fill:#fbbf24,stroke:#333
    style ParentDash fill:#f472b6,stroke:#333
    style AdminDash fill:#34d399,stroke:#333
    style Reward fill:#fcd34d,stroke:#333
    style VerifyEmail fill:#60a5fa,stroke:#333
```

## Precision Details

### 1. The Admin Bypass Mechanism
Unlike standard users stored in the `profiles` table, the **System Administrator** role is handled via environmental injection.
- **Trigger**: `process.env.ADMIN_EMAIL` and `process.env.ADMIN_PASSWORD`.
- **Enforcement**: Sets an `httpOnly` cookie named `admin_session`.
- **Middleware**: Explicitly checks for this cookie to grant access to `/dashboard/admin` even if no Supabase Auth session is active.

### 2. Parent-Child Linking (Atomic vs. Deferred)
- **Atomic Linking**: During registration, if a parent provides a valid child username, the link is created immediately upon account creation.
- **Deferred Linking**: Parents can link children at any time from their dashboard via a dedicated search-and-add interface.

### 3. MFA Logic
Security is tiered. MFA is **Parent-Optional** (enrolled via Security Hub) but **Enforced upon Login** if factors exist.
1.  Sign-In succeeds via Password (`aal1`).
2.  System checks for `verified` factors.
3.  If found, the session stays in a "restricted" state until verified via `/verify-2fa` (`aal2`).

### 4. Learning State Persistence
Progress is tracked using a resolution layer.
- **Local Module ID** (e.g., `num-1`) is mapped to a **Database Module UUID** by title.
- This ensures that if the static module data changes (e.g., new SVG or prompt), the child's historical progress remains pinned to the correct database record.
