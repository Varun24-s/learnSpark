"use client";

import { useState, useRef, useCallback } from "react";

/**
 * ParentalGate
 * Navigation guard that requires a 3-second long-press to activate.
 * Uses Tailwind v4 and Premium aesthetics.
 */
export default function ParentalGate({ onUnlock, children, id = "parental-gate-btn" }) {
    const [progress, setProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    const timerRef = useRef(null);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);

    const HOLD_DURATION = 3000;
    const UPDATE_INTERVAL = 50;

    const startHold = useCallback(() => {
        if (unlocked) return;
        setIsHolding(true);
        startTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100);
            setProgress(pct);
        }, UPDATE_INTERVAL);

        timerRef.current = setTimeout(() => {
            setUnlocked(true);
            setIsHolding(false);
            setProgress(100);
            clearInterval(intervalRef.current);
            if (onUnlock) onUnlock();
        }, HOLD_DURATION);
    }, [unlocked, onUnlock]);

    const cancelHold = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsHolding(false);
        setProgress(0);
        startTimeRef.current = null;
    }, []);

    return (
        <div className="relative inline-block">
            <button
                id={id}
                className={`
                    relative w-16 h-16 flex items-center justify-center glass rounded-2xl transition-all duration-300
                    hover:-translate-y-1 hover:shadow-clay-hover active:scale-95 cursor-pointer overflow-hidden
                    ${isHolding ? "scale-110 shadow-inner-clay" : ""}
                    ${unlocked ? "text-emerald-500 border-emerald-200" : "text-text-light"}
                `}
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                onTouchCancel={cancelHold}
                aria-label="Hold for 3 seconds to access parent settings"
                role="button"
                type="button"
            >
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none" stroke="currentColor" strokeWidth="6"
                        className="opacity-10"
                    />
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none" stroke="currentColor" strokeWidth="6"
                        strokeLinecap="round"
                        className="transition-all duration-150"
                        style={{
                            strokeDasharray: 283,
                            strokeDashoffset: 283 - (283 * progress) / 100
                        }}
                    />
                </svg>

                <div className="relative z-10">
                    {children || (
                        <div className="text-xl font-black">
                            {unlocked ? "✨" : "⚙️"}
                        </div>
                    )}
                </div>
            </button>

            {isHolding && !unlocked && (
                <div className="absolute top-[-45px] left-1/2 -translate-x-1/2 glass px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-primary animate-pop whitespace-nowrap">
                    Hold Tight...
                </div>
            )}
        </div>
    );
}
