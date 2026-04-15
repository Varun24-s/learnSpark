"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useSensory } from "@/context/SensoryContext";
import { getModuleById, MODULES } from "@/lib/modules-data";
import { updateStudentProgress } from "@/lib/progress";
import { ArrowLeft, Star, Sparkles, Trophy, Home, Play, CheckCircle2 } from "lucide-react";

export default function ActivityPage() {
    const { id } = useParams();
    const router = useRouter();
    const { narrate, pulse } = useSensory();

    const mod = getModuleById(id);
    const [taps, setTaps] = useState(0);
    const [selectedShape, setSelectedShape] = useState(null);
    const [phase, setPhase] = useState("intro"); // intro → exercise → reward
    const [stars, setStars] = useState(0);

    const exercise = mod?.content?.exercise;
    const isTapCount = exercise?.type === "tap_count";
    const isFindShape = exercise?.type === "find_shape";

    // Narrate intro on mount
    useEffect(() => {
        if (mod) {
            narrate(mod.content.tts_prompt);
        }
    }, [mod, narrate]);

    // When phase changes to exercise, narrate the prompt
    useEffect(() => {
        if (phase === "exercise" && exercise) {
            narrate(exercise.prompt);
        }
    }, [phase, exercise, narrate]);

    const handleComplete = useCallback(
        (earned) => {
            setStars(earned);
            setPhase("reward");
            pulse([80, 40, 80, 40, 120]);
            narrate(mod.content.reward_phrase);
            updateStudentProgress(mod.id, earned).catch(() => { });
        },
        [mod, narrate, pulse]
    );

    const handleTap = useCallback(() => {
        if (phase !== "exercise" || !isTapCount) return;
        pulse();
        const newTaps = taps + 1;
        setTaps(newTaps);
        narrate(String(newTaps));

        if (newTaps === exercise.correct_answer) {
            handleComplete(1);
        } else if (newTaps > exercise.correct_answer) {
            setTaps(0);
            narrate("Oops! Let's try again. " + exercise.prompt);
        }
    }, [phase, isTapCount, taps, exercise, pulse, narrate, handleComplete]);

    const handleShapePick = useCallback(
        (shape) => {
            if (phase !== "exercise" || !isFindShape) return;
            pulse();
            setSelectedShape(shape);

            if (shape === exercise.correct_shape) {
                handleComplete(3);
            } else {
                narrate("Not quite! Try again.");
                setTimeout(() => setSelectedShape(null), 800);
            }
        },
        [phase, isFindShape, exercise, pulse, narrate, handleComplete]
    );

    if (!mod) {
        return (
            <main className="min-h-dvh flex flex-col items-center justify-center p-8 bg-clay-cream">
                <p className="text-text-mid font-black text-xl mb-6 tracking-tight">Activity not found.</p>
                <button
                    onClick={() => router.push("/dashboard/child")}
                    className="px-8 py-4 bg-white border-4 border-slate-50 rounded-[2rem] font-black text-text-dark shadow-clay-lg hover:shadow-clay-hover transition-all flex items-center gap-3"
                >
                    <ArrowLeft size={22} /> Go Back Home
                </button>
            </main>
        );
    }

    const SHAPE_OPTIONS = [
        { key: "circle", svg: '<circle cx="50" cy="50" r="40" />', color: "#f06292" },
        { key: "square", svg: '<rect x="12" y="12" width="76" height="76" rx="8" />', color: "#4dd0e1" },
        { key: "triangle", svg: '<polygon points="50,10 92,88 8,88" />', color: "#4dd0a5" },
    ];

    return (
        <main className="relative min-h-dvh font-body bg-clay-cream/30 overflow-hidden max-w-2xl mx-auto p-8">
            <div className="fixed inset-0 z-[-1] bg-radial-[circle_at_50%_0%] from-primary/10 via-transparent to-transparent pointer-events-none" />

            {/* Header */}
            <header className="flex items-center justify-between mb-12 animate-fade-up">
                <button
                    className="w-14 h-14 flex items-center justify-center glass rounded-2xl text-text-light hover:text-primary transition-all shadow-clay active:scale-95 cursor-pointer group"
                    onClick={() => router.back()}
                    id="activity-back"
                    aria-label="Go Back"
                >
                    <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <span className="text-xl font-black text-text-dark tracking-tighter glass px-8 py-3 rounded-2xl border-white shadow-clay">
                    {mod.title}
                </span>
            </header>

            {/* === INTRO PHASE === */}
            {phase === "intro" && (
                <div className="flex flex-col items-center gap-10 text-center animate-fade-up">
                    <div className="w-[240px] h-[240px] rounded-[4rem] bg-white border-[6px] border-white shadow-clay-lg flex items-center justify-center relative animate-float overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br transition-opacity opacity-20" style={{ backgroundColor: mod.content.color }} />
                        {mod.content.svg ? (
                            <svg viewBox="0 0 100 100" className="w-[160px] h-[160px] relative z-10 filter drop-shadow-xl" aria-hidden="true"
                                stroke={mod.content.svg.includes('path') ? mod.content.color : 'none'}
                                strokeWidth={mod.content.svg.includes('path') ? "12" : "0"}
                                fill={mod.content.svg.includes('path') ? 'none' : mod.content.color}>
                                <g dangerouslySetInnerHTML={{ __html: mod.content.svg }} />
                            </svg>
                        ) : (
                            <span className="text-9xl relative z-10 animate-float">{mod.content.emoji}</span>
                        )}
                        <Sparkles className="absolute top-6 right-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-6">
                        <p className="text-3xl font-black text-text-dark leading-tight tracking-tighter">{mod.content.description}</p>
                        <button
                            className="inline-flex items-center gap-3 px-14 py-6 bg-primary text-white text-2xl font-black rounded-full shadow-clay-lg hover:shadow-clay-hover hover:-translate-y-2 transition-all active:scale-95 cursor-pointer shadow-[0_15px_40px_rgba(124,111,247,0.3)] mt-4"
                            onClick={() => setPhase("exercise")}
                            id="start-exercise"
                        >
                            <Play fill="currentColor" size={28} /> Let&apos;s Play!
                        </button>
                    </div>
                </div>
            )}

            {/* === EXERCISE PHASE === */}
            {phase === "exercise" && (
                <div className="flex flex-col items-center gap-12 text-center animate-fade-up">
                    <p className="text-4xl font-black text-text-dark leading-tight tracking-tighter max-w-sm">{exercise.prompt}</p>

                    {isTapCount && (
                        <div className="flex flex-col items-center gap-10 w-full animate-pop">
                            <div className="flex gap-4 justify-center bg-white/40 p-4 rounded-3xl glass shadow-inner-clay min-w-[200px]">
                                {Array.from({ length: exercise.correct_answer }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-6 h-6 rounded-full transition-all duration-500 shadow-sm border-2 border-white ${i < taps ? "scale-125 shadow-clay group" : "bg-slate-100"}`}
                                        style={{ backgroundColor: i < taps ? mod.content.color : undefined }}
                                    >
                                        {i < taps && <Sparkles size={10} className="text-white m-auto" />}
                                    </div>
                                ))}
                            </div>
                            <button
                                className="w-[280px] h-[280px] rounded-full bg-white border-[16px] border-white shadow-clay-lg flex items-center justify-center cursor-pointer transition-all active:scale-[0.8] hover:shadow-clay-hover animate-float relative overflow-hidden group"
                                style={{ borderColor: `${mod.content.color}30` }}
                                onClick={handleTap}
                                id="tap-button"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <span className="text-5xl font-black tracking-widest text-text-dark drop-shadow-sm group-active:scale-125 transition-transform">TAP!</span>
                            </button>
                        </div>
                    )}

                    {isFindShape && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full animate-pop">
                            {SHAPE_OPTIONS.map((s) => (
                                <button
                                    key={s.key}
                                    className={`relative flex flex-col items-center justify-center p-10 bg-white border-4 border-white rounded-[3.5rem] shadow-clay-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-clay-hover active:scale-95 cursor-pointer group 
                                        ${selectedShape === s.key ? (s.key === exercise.correct_shape ? "border-emerald-400 bg-emerald-50 scale-105" : "border-rose-300 bg-rose-50 scale-95 opacity-50") : "hover:border-primary/20"}`}
                                    onClick={() => handleShapePick(s.key)}
                                    id={`shape-${s.key}`}
                                >
                                    <svg viewBox="0 0 100 100" className="w-[110px] h-[110px] transition-transform group-hover:scale-110 drop-shadow-xl" aria-hidden="true">
                                        <g
                                            fill={s.color}
                                            opacity=".9"
                                            dangerouslySetInnerHTML={{ __html: s.svg }}
                                        />
                                    </svg>
                                    {selectedShape === s.key && s.key === exercise.correct_shape && (
                                        <CheckCircle2 size={32} className="absolute -top-3 -right-3 text-emerald-500 bg-white rounded-full shadow-clay animate-pop" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* === REWARD PHASE === */}
            {phase === "reward" && (
                <div className="flex flex-col items-center gap-10 text-center animate-pop">
                    <div className="relative mb-8">
                        <div className="flex gap-6 justify-center items-end h-40">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="relative animate-float" style={{ animationDelay: `${s * 0.3}s` }}>
                                    <Star
                                        size={s === 2 ? 100 : 70}
                                        className={`transition-all duration-1000 transform ${s <= stars ? "scale-100 text-[#fcd34d] drop-shadow-[0_10px_30px_rgba(252,211,77,0.5)]" : "scale-50 text-slate-100 opacity-20"}`}
                                        fill={s <= stars ? "currentColor" : "none"}
                                        strokeWidth={1.5}
                                    />
                                    {s <= stars && <Sparkles className="absolute top-0 right-0 text-primary animate-sparkle-drift" size={24} />}
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-clay-yellow/10 rounded-full blur-[100px] pointer-events-none" />
                    </div>

                    <div className="space-y-4 relative z-10">
                        <h2 className="text-6xl font-black text-text-dark tracking-tighter drop-shadow-sm flex items-center justify-center gap-4">
                            Amazing! <Sparkles className="text-primary animate-sparkle-drift" size={48} />
                        </h2>
                        <p className="text-2xl font-black text-text-mid italic max-w-sm mx-auto leading-relaxed px-6 py-3 glass rounded-full shadow-inner-clay">{mod.content.reward_phrase}</p>
                    </div>

                    <div className="flex flex-col gap-5 w-full max-w-xs mt-8 relative z-10">
                        <button
                            className="w-full py-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-2xl font-black rounded-[2.5rem] shadow-clay-lg hover:shadow-clay-hover hover:-translate-y-2 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(52,211,153,0.3)] group"
                            onClick={() => {
                                const catModules = MODULES.filter((m) => m.category === mod.category);
                                const idx = catModules.findIndex((m) => m.id === mod.id);
                                const next = catModules[idx + 1];
                                if (next) {
                                    router.push(`/dashboard/child/modules/${next.id}`);
                                } else {
                                    router.push("/dashboard/child");
                                }
                            }}
                            id="next-module"
                        >
                            Next Rocket <RocketIcon size={28} className="rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                        <button
                            className="w-full py-4 text-text-light font-black hover:text-text-mid transition-all flex items-center justify-center gap-2 hover:translate-y-[-2px] tracking-widest uppercase text-xs"
                            onClick={() => router.push("/dashboard/child")}
                            id="go-home"
                        >
                            <Home size={18} /> Back Hub
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

function RocketIcon({ ...props }) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3" />
            <path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5" />
        </svg>
    )
}
