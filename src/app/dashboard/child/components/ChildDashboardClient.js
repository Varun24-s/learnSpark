"use client";

import { useRouter } from "next/navigation";
import { useSensory } from "@/context/SensoryContext";
import ParentalGate from "@/components/ParentalGate/ParentalGate";
import { useEffect } from "react";
import { Star, Layout, Shapes, ArrowRight, Home, LogOut, Sparkles } from "lucide-react";
import { signOut } from "@/lib/auth";

const CATEGORIES = [
    {
        key: "Numeracy",
        Icon: Layout,
        label: "Numbers",
        desc: "Count 1, 2, 3",
        color: "#fbbf24", // Amber
        bg: "from-clay-yellow to-orange-400",
    },
    {
        key: "Shapes",
        Icon: Shapes,
        label: "Shapes",
        desc: "Circles, squares & more",
        color: "#22d3ee", // Cyan
        bg: "from-clay-sky to-blue-400",
    },
];

export default function ChildDashboardClient({ user, isProxy, realUserRole, totalStars }) {
    const { narrate, pulse } = useSensory();
    const router = useRouter();

    useEffect(() => {
        if (user && !isProxy) {
            const n = user.display_name || "friend";
            const t = setTimeout(() => narrate(`Hello ${n}! Welcome to Learn Spark! What would you like to learn today?`), 600);
            return () => clearTimeout(t);
        }
    }, [user, isProxy, narrate]);

    async function handleSignOut() {
        await signOut();
        router.push("/");
    }

    return (
        <main className={`relative min-h-dvh p-8 pb-24 max-w-2xl mx-auto flex flex-col gap-10 transition-all duration-700 ${isProxy ? "border-[12px] border-primary/20 rounded-[4rem] my-6 shadow-clay-lg" : ""}`}>
            {/* Smooth Radial Background */}
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#fefaff]" />
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-radial-[circle_at_50%_10%] from-primary/10 via-transparent to-transparent opacity-60" />

            {/* Header */}
            <header className="flex items-center justify-between animate-fade-up">
                <div className="flex items-center gap-6">
                    <div className="relative group cursor-default w-20 h-20 glass rounded-3xl flex items-center justify-center shadow-clay border-2 border-white">
                        <Star className="text-clay-yellow animate-float" size={48} fill="#fcd34d" />
                        <Sparkles className="absolute -top-2 -right-2 text-primary animate-sparkle-drift" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-text-dark tracking-tighter leading-tight">
                            {isProxy ? `${user.display_name}'s Space` : `Hi, ${user.display_name}!`}
                        </h1>
                        <p className="text-text-mid font-black text-lg opacity-80 italic">
                            {isProxy ? "Viewing progress as parent" : "Ready to learn today?"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {isProxy ? (
                        <button
                            onClick={() => router.push("/dashboard/parent")}
                            className="flex items-center gap-2 px-6 py-3 glass rounded-[1.8rem] font-black text-text-dark hover:text-primary hover:-translate-y-1 transition-all shadow-clay active:scale-95 group"
                        >
                            <Home size={22} className="group-hover:rotate-6 transition-transform" /> <span className="hidden sm:inline">My Hub</span>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSignOut}
                                className="w-14 h-14 flex items-center justify-center glass rounded-2xl text-text-light hover:text-red-500 hover:-translate-y-1 transition-all shadow-clay active:scale-95 group"
                                aria-label="Sign Out"
                            >
                                <LogOut size={24} className="group-hover:rotate-12 transition-transform" />
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Topics Section */}
            <section className="flex flex-col gap-6 animate-fade-up [animation-delay:0.1s]">
                <h2 className="text-[13px] font-black text-text-light tracking-[0.2em] uppercase ml-4">Choose a Planet</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {CATEGORIES.map((c, i) => (
                        <button
                            key={c.key}
                            className={`group relative flex flex-col items-center gap-5 p-10 rounded-[3.5rem] bg-white border-2 border-slate-50 shadow-clay-lg transition-all duration-500 
                                ${isProxy ? "cursor-default opacity-85" : "hover:-translate-y-3 hover:shadow-clay-hover hover:border-black/5 active:scale-95 cursor-pointer animate-float"}`}
                            style={{ animationDelay: `${i * 0.2}s` }}
                            onClick={() => {
                                if (isProxy) return;
                                pulse();
                                narrate(`Let's learn about ${c.label}!`);
                                router.push(`/dashboard/child/modules?category=${c.key}`);
                            }}
                            disabled={isProxy}
                        >
                            <div className={`w-28 h-28 rounded-[2.5rem] bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-clay border-4 border-white transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 shadow-[inset_0_-8px_20px_rgba(0,0,0,0.1)]`}>
                                <c.Icon size={56} color="white" strokeWidth={1.5} />
                            </div>
                            <div className="text-center">
                                <span className="block text-3xl font-black text-text-dark tracking-tighter mb-1">{c.label}</span>
                                <span className="text-sm font-black text-text-mid opacity-70 italic">{c.desc}</span>
                            </div>
                            {!isProxy && (
                                <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                    <ArrowRight className="text-primary" size={28} strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Stars Container */}
            <section className="flex items-center gap-6 p-8 glass-lg rounded-[3rem] animate-fade-up [animation-delay:0.3s] group overflow-hidden relative">
                <div className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-clay-yellow/20 rounded-full blur-3xl animate-orb-drift opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative w-24 h-24 rounded-[1.8rem] bg-gradient-to-br from-clay-yellow to-orange-400 flex items-center justify-center shadow-clay border-4 border-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Star size={48} fill="white" stroke="white" className="animate-float" />
                </div>
                <div className="flex-1">
                    <span className="block font-black text-text-dark text-2xl tracking-tighter mb-1">
                        {isProxy ? "Progress Tracker" : "Earn More Stars!"}
                    </span>
                    <span className="text-[17px] font-black text-text-mid italic opacity-70">
                        {isProxy ? "Check out the stars earned!" : "Complete activities to grow your chart."}
                    </span>
                </div>
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-50/50 shadow-inner-clay border-2 border-white/50">
                    <span className="text-2xl font-black text-primary">{totalStars}</span>
                </div>
            </section>
        </main>
    );
}
