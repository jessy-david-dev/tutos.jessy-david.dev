"use client";

import { siteConfig } from "@/config/site";
import {
    GithubOutlined,
    LinkedinOutlined,
    XOutlined,
} from "@lineiconshq/free-icons";
import { Lineicons } from "@lineiconshq/react-lineicons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const socialIcons = {
    github: GithubOutlined,
    linkedin: LinkedinOutlined,
    x: XOutlined,
} as const;

const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/tutos", label: "Tutoriels" },
    { href: "/dashboard", label: "Dashboard" },
];

export function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);
    const socialRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                },
            });

            tl.fromTo(
                logoRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );

            tl.fromTo(
                linksRef.current?.querySelectorAll("a") || [],
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "power2.out",
                },
                "-=0.3"
            );

            tl.fromTo(
                socialRef.current?.querySelectorAll("a") || [],
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "back.out(1.7)",
                },
                "-=0.3"
            );

            tl.fromTo(
                bottomRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5 },
                "-=0.2"
            );
        }, footerRef);

        return () => ctx.revert();
    }, []);

    const handleSocialHover = (e: React.MouseEvent, entering: boolean) => {
        gsap.to(e.currentTarget, {
            scale: entering ? 1.15 : 1,
            y: entering ? -3 : 0,
            duration: 0.25,
            ease: "power2.out",
        });
    };

    return (
        <footer
            ref={footerRef}
            className="relative border-t border-slate-800/50 bg-slate-950"
        >
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div ref={contentRef} className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                    {/* Logo & description */}
                    <div ref={logoRef} className="space-y-4">
                        <Link href="/" className="inline-block group">
                            <span className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                                {siteConfig.name}
                            </span>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Une collection de guides pratiques. Apprenez à votre
                            rythme avec des exemples concrets.
                        </p>
                        <p className="font-mono text-xs text-slate-600">
                            tutos.jessy-david.dev
                        </p>
                    </div>

                    {/* Navigation */}
                    <div ref={linksRef} className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Navigation
                        </h3>
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group relative text-sm text-slate-500 hover:text-cyan-400 transition-colors w-fit"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-linear-to-r from-cyan-400 to-cyan-500 transition-all duration-600 ease-out group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Suivez-moi
                        </h3>
                        <div
                            ref={socialRef}
                            className="flex items-center gap-3"
                        >
                            {Object.entries(siteConfig.socials).map(
                                ([key, social]) => (
                                    <Link
                                        key={key}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        onMouseEnter={(e) =>
                                            handleSocialHover(e, true)
                                        }
                                        onMouseLeave={(e) =>
                                            handleSocialHover(e, false)
                                        }
                                        className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                                    >
                                        <Lineicons
                                            icon={
                                                socialIcons[
                                                    key as keyof typeof socialIcons
                                                ]
                                            }
                                            size={20}
                                        />
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    ref={bottomRef}
                    className="mt-12 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <p className="text-xs text-slate-600 font-mono">
                        &copy; {new Date().getFullYear()} {siteConfig.name}.
                        Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}
