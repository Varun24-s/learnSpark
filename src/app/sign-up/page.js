import Link from "next/link";
import { User, Users, ArrowRight, Star, Sparkles } from "lucide-react";

export const metadata = {
    title: "Join LearnSpark — Choose Your Role",
    description: "Create your LearnSpark account as a child or a parent.",
};

const ROLES = [
    {
        id: "role-select-child",
        href: "/sign-up/child",
        Icon: User,
        label: "Little Explorer",
        desc: "I want to learn, play, and earn stars!",
        theme: "from-clay-yellow to-[#fbbf24]",
        shadow: "shadow-[0_10px_30px_rgba(251,191,36,0.2)]",
        iconColor: "#d97706",
    },
    {
        id: "role-select-parent",
        href: "/sign-up/parent",
        Icon: Users,
        label: "Parent / Guardian",
        desc: "I want to track progress and manage settings.",
        theme: "from-primary to-primary-deep",
        shadow: "shadow-[0_10px_30px_rgba(124,111,247,0.2)]",
        iconColor: "#ffffff",
    },
];

export default function RoleSelectionPage() {
    return (
        <main className="relative min-h-dvh flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] bg-clay-mint/25 rounded-full blur-[100px] animate-orb-drift" />
                <div className="absolute bottom-[-10%] right-[-15%] w-[600px] h-[600px] bg-clay-peach/25 rounded-full blur-[100px] animate-orb-drift [animation-delay:-5s]" />
                <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-clay-sky/20 rounded-full blur-[80px] animate-orb-drift [animation-delay:-8s]" />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <header className="text-center mb-12 animate-fade-up">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="relative">
                            <Star className="text-clay-yellow animate-float" fill="#fcd34d" size={40} />
                            <Sparkles className="absolute -top-2 -right-2 text-primary animate-sparkle-drift" size={20} />
                        </div>
                        <span className="text-3xl font-black tracking-tight text-text-dark font-display">LearnSpark</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl text-text-dark mb-4 font-black">Welcome! I am a…</h1>
                    <p className="text-text-mid font-extrabold text-xl">Choose your seat on the spark shuttle!</p>
                </header>

                <div className="flex flex-col gap-6">
                    {ROLES.map((r, i) => (
                        <Link
                            key={r.id}
                            href={r.href}
                            className={`group flex items-center gap-6 p-8 glass rounded-[3rem] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-clay-hover ${r.shadow}`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${r.theme} flex items-center justify-center shadow-clay border-4 border-white transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`} style={{ color: r.iconColor }}>
                                <r.Icon size={46} strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-black text-text-dark mb-1 ml-1">{r.label}</h2>
                                <p className="text-text-mid font-bold text-[15px] leading-snug ml-1 opacity-80">{r.desc}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full glass border-white flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                                <ArrowRight size={24} className="text-primary" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center flex flex-col gap-5 animate-fade-up [animation-delay:0.3s]">
                    <p className="text-text-mid font-extrabold text-lg">
                        Already have an account? <Link href="/sign-in" className="text-primary hover:underline hover:scale-105 inline-block transition-transform">Sign in here</Link>
                    </p>
                    <Link href="/" className="text-text-light hover:text-text-mid text-sm font-black tracking-wide uppercase flex items-center justify-center gap-2 group transition-all">
                        <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
