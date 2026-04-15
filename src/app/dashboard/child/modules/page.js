"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSensory } from "@/context/SensoryContext";
import { getModulesByCategory } from "@/lib/modules-data";
import { useEffect, Suspense } from "react";
import { ArrowLeft, Sparkles, Star, Shapes } from "lucide-react";

function ModulesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { narrate, pulse } = useSensory();

    const category = searchParams.get("category") || "Numeracy";
    const modules = getModulesByCategory(category);
    const isNumeracy = category === "Numeracy";

    useEffect(() => {
        narrate(
            isNumeracy
                ? "Let's learn about numbers! Pick a number to start."
                : "Let's explore shapes! Pick a shape to learn about."
        );
    }, [category, isNumeracy, narrate]);

    return (
        <main className="relative min-h-dvh font-body bg-clay-cream/30 overflow-hidden p-8 max-w-2xl mx-auto">
            {/* Background element */}
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-radial-[ellipse_60%_40%_at_50%_10%] from-primary/10 to-transparent opacity-40" />

            <header className="flex items-center gap-6 mb-12 animate-fade-up">
                <button
                    className="w-14 h-14 flex items-center justify-center glass rounded-2xl text-text-light hover:text-primary transition-all shadow-clay active:scale-95 cursor-pointer group"
                    onClick={() => router.push("/dashboard/child")}
                    id="modules-back"
                    aria-label="Back to Dashboard"
                >
                    <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-4xl font-black text-text-dark tracking-tighter flex items-center gap-3">
                        <span className="w-12 h-12 flex items-center justify-center glass rounded-xl shadow-clay border border-white">
                            {isNumeracy ? <Star className="text-clay-yellow" fill="#fcd34d" size={24} /> : <Shapes className="text-clay-sky" size={24} />}
                        </span>
                        {isNumeracy ? "Numbers" : "Shapes"}
                    </h1>
                    <p className="text-text-mid font-black text-sm uppercase tracking-[0.2em] ml-1 opacity-60">Planet Academy</p>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full animate-fade-up [animation-delay:0.1s]">
                {modules.map((mod, i) => (
                    <button
                        key={mod.id}
                        className="group relative flex flex-col items-center gap-4 p-12 rounded-[3.5rem] bg-white border-2 border-white shadow-clay-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-clay-hover active:scale-95 cursor-pointer animate-float"
                        style={{
                            animationDelay: `${i * 0.1}s`,
                        }}
                        onClick={() => {
                            pulse();
                            narrate(mod.content.tts_prompt);
                            router.push(`/dashboard/child/modules/${mod.id}`);
                        }}
                        id={`module-${mod.id}`}
                    >
                        <div className="w-28 h-28 rounded-[2.2rem] flex items-center justify-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 bg-slate-50/50 shadow-inner-clay border-2 border-white relative overflow-hidden">
                            {mod.content.svg ? (
                                <svg
                                    viewBox="0 0 100 100"
                                    className="w-20 h-20 transition-all duration-700 group-hover:scale-110 drop-shadow-md"
                                    aria-hidden="true"
                                    stroke={mod.content.svg.includes('path') ? mod.content.color : 'none'}
                                    strokeWidth={mod.content.svg.includes('path') ? "12" : "0"}
                                    fill={mod.content.svg.includes('path') ? 'none' : mod.content.color}
                                >
                                    <g opacity=".9" dangerouslySetInnerHTML={{ __html: mod.content.svg }} />
                                </svg>
                            ) : (
                                <span className="text-6xl drop-shadow-md" aria-hidden="true">
                                    {mod.content.emoji}
                                </span>
                            )}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/20 to-transparent" />
                        </div>

                        <div className="text-center space-y-1">
                            <span className="block text-3xl font-black text-text-dark tracking-tighter">{mod.title}</span>
                            <span className="block text-sm font-black text-text-mid italic opacity-70 leading-tight">{mod.content.description}</span>
                        </div>

                        <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <Sparkles size={24} className="text-primary animate-sparkle-drift" />
                        </div>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary/20 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </button>
                ))}
            </div>

            <footer className="mt-20 text-center flex flex-col items-center gap-4 opacity-50 animate-fade-up [animation-delay:0.3s]">
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => <Star key={i} size={16} className="text-clay-yellow" fill="currentColor" />)}
                </div>
                <p className="text-xs font-black tracking-widest text-text-light uppercase">Keep exploring to grow your star chart</p>
            </footer>
        </main>
    );
}

export default function ModulesPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-dvh bg-clay-cream">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-white border-4 border-slate-100 border-t-primary animate-spin shadow-clay" />
                </div>
            }
        >
            <ModulesContent />
        </Suspense>
    );
}
