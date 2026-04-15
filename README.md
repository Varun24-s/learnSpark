# LearnSpark 🚀

**LearnSpark** is a premium, sensory-first learning platform designed specifically for neurodivergent children. Built with a "Planet Academy" theme, it leverages **Web Speech** and **Vibration APIs** to create a high-fidelity, inclusive learning experience.

![LearnSpark Preview](https://via.placeholder.com/800x400.png?text=LearnSpark+Premium+Claymorphism+UI)

## ✨ Core Features

- **Sensory-First Architecture**: Integrated Text-to-Speech (TTS) narration and Haptic Feedback (Vibration) for every interaction.
- **Role-Based Experience**: Dedicated dashboards for **Children**, **Parents**, and **Admins**.
- **Thematic Modules**: Interactive Numeracy and Shape recognition activities with stylized SVG visuals.
- **Premium Aesthetics**: High-fidelity "Anti-Gravity Claymorphism" UI built with Tailwind CSS v4.
- **Parental Oversight**: Secure parent-child linking to monitor progress and stars earned.
- **Admin Control**: Pre-decided credentials for quick administrative oversight.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Auth & Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Sensory**: Web Speech API & Navigator.vibrate

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- A Supabase Project

### 2. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Admin Credentials
ADMIN_EMAIL=admin@learnspark.com
ADMIN_PASSWORD=admin123
```

### 3. Database Setup
1. Run the contents of `supabase/schema.sql` in your Supabase SQL Editor.
2. Run `supabase/seed.sql` to populate the initial learning modules.

### 4. Installation
```bash
npm install
npm run dev
```

## 📖 Learn More
For a deep dive into the system logic, check out the [Architecture Documentation](ARCHITECTURE.md).
