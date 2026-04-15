# LearnSpark Environment Setup

## Required Environment Variables

Copy `.env.local` and fill in real values:

### Clerk (Authentication)
1. Go to [clerk.com](https://clerk.com) → Create application
2. Copy **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. Copy **Secret Key** → `CLERK_SECRET_KEY`
4. In Clerk Dashboard → JWT Templates → Create "supabase" template with:
   ```json
   {
     "iss": "https://YOUR_CLERK_FRONTEND_API",
     "sub": "{{user.id}}",
     "aud": "authenticated",
     "role": "authenticated",
     "metadata": "{{user.public_metadata}}"
   }
   ```

### Roles (Automatic — No Manual Setup)
Roles are assigned **automatically** during sign-up:
- Users visit `/sign-up` and choose: **Child**, **Parent**, or **Educator**
- Each option leads to a role-specific Clerk sign-up page
- After sign-up, `/api/set-role` automatically writes the role to `publicMetadata`
- The `/dashboard` page reads the role and redirects accordingly

**You do NOT need to manually set `publicMetadata` on any user.**

### Supabase (Database)
1. Go to [supabase.com](https://supabase.com) → Create project
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
5. Run `supabase/schema.sql` in the SQL Editor
6. Run `supabase/seed.sql` to populate initial modules
7. In Supabase → Authentication → JWT Secret, use Clerk's JWT signing key

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Sign-Up Flow

```
/sign-up                  → Role selection (Child / Parent / Educator)
/sign-up/child            → Clerk sign-up → auto-sets role=CHILD
/sign-up/parent           → Clerk sign-up → auto-sets role=PARENT
/sign-up/educator         → Clerk sign-up → auto-sets role=EDUCATOR
/api/set-role?role=X      → Sets publicMetadata → redirects to dashboard
/dashboard                → Reads role → routes to correct dashboard
```
