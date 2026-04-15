"use client";

import { useSensory } from "@/context/SensoryContext";

/**
 * BigTouchButton
 * A large, accessible button designed for young children.
 * Uses Premium Tailwind v4 Claymorphism.
 */
export default function BigTouchButton({
    label,
    narrationText,
    onClick,
    color = "primary",
    icon,
    size = "large",
    disabled = false,
    className = "",
    id,
}) {
    const { narrate, pulse } = useSensory();

    const colorMap = {
        primary: "bg-primary text-white shadow-[0_12px_40px_rgba(124,111,247,0.3)]",
        success: "bg-emerald-400 text-white shadow-[0_12px_40px_rgba(52,211,153,0.3)]",
        warning: "bg-clay-yellow text-text-dark shadow-[0_12px_40px_rgba(252,211,77,0.3)]",
        info: "bg-clay-sky text-text-dark shadow-[0_12px_40px_rgba(186,230,253,0.3)]",
    };

    const sizeMap = {
        medium: "px-8 py-5 text-lg rounded-[2rem]",
        large: "px-12 py-8 text-2xl rounded-[2.5rem]",
        xl: "px-16 py-12 text-4xl rounded-[3.5rem]",
    };

    const handleInteraction = (e) => {
        if (disabled) return;
        pulse();
        narrate(narrationText || label);
        if (onClick) onClick(e);
    };

    return (
        <button
            id={id}
            className={`
                group relative flex flex-col items-center gap-3 font-black tracking-tighter transition-all duration-300
                hover:-translate-y-2 hover:shadow-clay-hover active:translate-y-0 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white
                ${colorMap[color] || colorMap.primary}
                ${sizeMap[size] || sizeMap.large}
                ${className}
            `}
            onClick={handleInteraction}
            disabled={disabled}
            aria-label={label}
            role="button"
            type="button"
        >
            {icon && (
                <span className="text-5xl group-hover:scale-110 transition-transform mb-2 drop-shadow-md animate-float" aria-hidden="true">
                    {icon}
                </span>
            )}
            <span className="relative z-10">{label}</span>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[inherit]" />
        </button>
    );
}
