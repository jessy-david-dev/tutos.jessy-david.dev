"use client";

import { loginWithDiscord } from "@/app/login/actions";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { SiDiscord } from "react-icons/si";

interface LoginContentProps {
    error?: string;
}

export function LoginContent({ error }: LoginContentProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLElement>(null);
    const dotsRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const errorRef = useRef<HTMLDivElement>(null);
    const bgOrb1Ref = useRef<HTMLDivElement>(null);
    const bgOrb2Ref = useRef<HTMLDivElement>(null);

    const getErrorMessage = (code?: string) => {
        if (!code) return null;
        if (code === "unauthorized") {
            return "Cet utilisateur Discord n'est pas autorisé.";
        }
        if (code === "oauth_failed") {
            return "La connexion avec Discord a échoué. Réessaie.";
        }
        return "Une erreur est survenue.";
    };

    const errorMessage = getErrorMessage(error);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            gsap.to(bgOrb1Ref.current, {
                x: 50,
                y: 30,
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.to(bgOrb2Ref.current, {
                x: -40,
                y: -20,
                duration: 6,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            tl.fromTo(
                cardRef.current,
                { opacity: 0, y: 40, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8 }
            );

            tl.fromTo(
                dotsRef.current?.children || [],
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "back.out(1.7)",
                },
                "-=0.4"
            );

            tl.fromTo(
                titleRef.current,
                { opacity: 0, clipPath: "inset(0 100% 0 0)" },
                { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.6 },
                "-=0.2"
            );

            if (errorRef.current) {
                tl.fromTo(
                    errorRef.current,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.4 },
                    "-=0.2"
                );
            }

            tl.fromTo(
                buttonRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 },
                "-=0.2"
            );

            gsap.to(buttonRef.current, {
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleButtonHover = () => {
        gsap.to(buttonRef.current, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
        });
    };

    const handleButtonLeave = () => {
        gsap.to(buttonRef.current, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
        });
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30"
        >
            {/* Effets de fond */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    ref={bgOrb1Ref}
                    className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
                />
                <div
                    ref={bgOrb2Ref}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"
                />
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Contenu */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
                <main
                    ref={cardRef}
                    className="w-full max-w-md bg-slate-900/80 border border-slate-700/50 rounded-xl p-8 shadow-lg backdrop-blur opacity-0"
                >
                    {/* Header type terminal */}
                    <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-700/50">
                        <div ref={dotsRef} className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-slate-500 text-xs font-mono ml-2">
                            ~/auth/login/
                        </span>
                    </div>

                    <section className="space-y-5">
                        <div className="space-y-2">
                            <h1
                                ref={titleRef}
                                className="text-3xl font-bold tracking-tight opacity-0"
                            >
                                <span className="bg-linear-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                    Connexion
                                </span>
                            </h1>
                        </div>

                        {/* Message d'erreur éventuel */}
                        {errorMessage && (
                            <div
                                ref={errorRef}
                                className="rounded border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 opacity-0"
                            >
                                {errorMessage}
                            </div>
                        )}

                        {/* Bouton Discord */}
                        <form action={loginWithDiscord} className="pt-2">
                            <button
                                ref={buttonRef}
                                type="submit"
                                onMouseEnter={handleButtonHover}
                                onMouseLeave={handleButtonLeave}
                                className="group flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg 
                                           bg-indigo-500/20 hover:bg-indigo-500/30 
                                           border border-indigo-400/40 hover:border-indigo-300
                                           text-indigo-100 transition-colors opacity-0 cursor-pointer"
                            >
                                <SiDiscord className="w-5 h-5 text-indigo-300 group-hover:text-indigo-100 transition-colors" />
                                <span className="font-mono text-sm">
                                    Se connecter avec Discord
                                </span>
                            </button>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}
