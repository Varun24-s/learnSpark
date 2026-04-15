"use client";

import { createContext, useContext, useCallback, useRef, useEffect } from "react";

const SensoryContext = createContext(null);

/**
 * SensoryProvider
 * Provides text-to-speech narration (Web Speech API) and
 * haptic feedback (Vibration API) to the entire application.
 */
export function SensoryProvider({ children }) {
    const synthRef = useRef(null);

    useEffect(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    /**
     * narrate(text) — Speaks the given text at 0.7x speed
     * with a warm, friendly voice suitable for young children.
     */
    const narrate = useCallback((text) => {
        if (!synthRef.current) return;

        // Cancel any ongoing speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.7;    // Slower for comprehension
        utterance.pitch = 1.2;   // Slightly higher, friendlier tone
        utterance.volume = 1.0;

        // Try to find a friendly English voice
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(
            (v) =>
                v.lang.startsWith("en") &&
                (v.name.includes("Female") ||
                    v.name.includes("Samantha") ||
                    v.name.includes("Karen") ||
                    v.name.includes("Google"))
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        synthRef.current.speak(utterance);
    }, []);

    /**
     * pulse() — Triggers haptic feedback using the Vibration API.
     * Falls back gracefully on unsupported devices.
     */
    const pulse = useCallback((pattern = [50, 30, 80]) => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }, []);

    /**
     * stopNarration() — Immediately stops any ongoing speech.
     */
    const stopNarration = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
        }
    }, []);

    const value = {
        narrate,
        pulse,
        stopNarration,
    };

    return (
        <SensoryContext.Provider value={value}>
            {children}
        </SensoryContext.Provider>
    );
}

/**
 * useSensory() — Hook to access narrate(), pulse(), and stopNarration()
 * from any component within the SensoryProvider tree.
 */
export function useSensory() {
    const ctx = useContext(SensoryContext);
    if (!ctx) {
        throw new Error("useSensory must be used within a <SensoryProvider>");
    }
    return ctx;
}
