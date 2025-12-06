"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

interface HeroSectionProps {
    tutorialsCount: number;
    categoriesCount: number;
    title?: string | null;
    filtered?: boolean;
}

// Effet de décryptage
function useScrambleText(
    text: string,
    options: {
        duration?: number;
        delay?: number;
        chars?: string;
    } = {}
) {
    const [displayText, setDisplayText] = useState("");
    const {
        duration = 1.5,
        delay = 0.3,
        chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789",
    } = options;

    useEffect(() => {
        const finalText = text;
        const length = finalText.length;
        let currentIndex = 0;

        // Délai initial
        const startTimeout = setTimeout(() => {
            const scrambleInterval = setInterval(() => {
                let result = "";

                for (let i = 0; i < length; i++) {
                    if (i < currentIndex) {
                        result += finalText[i];
                    } else if (finalText[i] === " ") {
                        result += " ";
                    } else {
                        // Caractère aléatoire
                        result +=
                            chars[Math.floor(Math.random() * chars.length)];
                    }
                }

                setDisplayText(result);
            }, 30);

            // Animation gsap pour révéler progressivement
            gsap.to(
                { value: 0 },
                {
                    value: length,
                    duration,
                    ease: "power2.inOut",
                    onUpdate: function () {
                        currentIndex = Math.floor(this.targets()[0].value);
                    },
                    onComplete: () => {
                        clearInterval(scrambleInterval);
                        setDisplayText(finalText);
                    },
                }
            );

            return () => clearInterval(scrambleInterval);
        }, delay * 1000);

        return () => clearTimeout(startTimeout);
    }, [text, duration, delay, chars]);

    return displayText;
}

export function HeroSection({
    tutorialsCount,
    categoriesCount,
    title,
    filtered = false,
}: HeroSectionProps) {
    const commandText = filtered
        ? `ls --filter="${title}"`
        : "cat hello_world.txt";

    const scrambledText = useScrambleText(commandText, {
        duration: 1.2,
        delay: 0.5,
        chars: "█▓▒░!@#$%&*<>[]{}|",
    });

    // Animation du curseur clignotant
    const cursorRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (cursorRef.current) {
            gsap.to(cursorRef.current, {
                opacity: 0,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut",
            });
        }
    }, []);

    return (
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-500 font-mono text-sm">
                    <span className="text-emerald-400">$</span>
                    <span className="relative">
                        {scrambledText}
                        <span
                            ref={cursorRef}
                            className="inline-block w-2 h-4 bg-emerald-400 ml-0.5 align-middle"
                        />
                    </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                    <span className="bg-linear-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        {title || "Mes Tutoriels"}
                    </span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                    {filtered
                        ? `${tutorialsCount} tutoriel${
                              tutorialsCount > 1 ? "s" : ""
                          } dans cette catégorie.`
                        : "Une collection de guides pratiques. Apprenez à votre rythme avec des exemples concrets."}
                </p>
            </div>
            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-8">
                <div className="space-y-1">
                    <div className="text-3xl font-bold text-slate-100">
                        {tutorialsCount}
                    </div>
                    <div className="text-sm text-slate-500 font-mono">
                        tutoriel{tutorialsCount > 1 ? "s" : ""}
                        {filtered ? " (filtrés)" : ""}
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-3xl font-bold text-slate-100">
                        {categoriesCount}
                    </div>
                    <div className="text-sm text-slate-500 font-mono">
                        catégories
                    </div>
                </div>
            </div>
        </section>
    );
}
