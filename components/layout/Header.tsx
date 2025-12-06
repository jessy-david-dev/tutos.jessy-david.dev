"use client";

import { useGSAP } from "@gsap/react";
import {
    Book1Outlined,
    DashboardSquare1Outlined,
    Home2Outlined,
} from "@lineiconshq/free-icons";
import { Lineicons } from "@lineiconshq/react-lineicons";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

// Constantes extraites du composant
const NAV_LINKS = [
    { href: "/", label: "Accueil", icon: Home2Outlined },
    { href: "/tutos", label: "Tous les tutos", icon: Book1Outlined },
    { href: "/dashboard", label: "Dashboard", icon: DashboardSquare1Outlined },
] as const;

// Types
type NavLinkType = (typeof NAV_LINKS)[number];

interface NavLinkProps {
    link: NavLinkType;
    isActive: boolean;
    onClick?: () => void;
    mobile?: boolean;
}

// Composant NavLink réutilisable
function NavLink({ link, isActive, onClick, mobile = false }: NavLinkProps) {
    const baseClass = mobile
        ? "px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-3"
        : "relative px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2";

    const activeClass = mobile
        ? "text-cyan-400 bg-cyan-500/10 border-l-2 border-cyan-400"
        : "text-cyan-400 active";

    const inactiveClass = mobile
        ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
        : "text-slate-400 hover:text-slate-100";

    return (
        <Link
            href={link.href}
            onClick={onClick}
            className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
            aria-current={isActive ? "page" : undefined}
        >
            <Lineicons icon={link.icon} size={mobile ? 20 : 18} />
            {link.label}
        </Link>
    );
}

// Composant SkipLink pour l'accessibilité
function SkipLink() {
    return (
        <Link
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg focus:outline-none"
        >
            Aller au contenu principal
        </Link>
    );
}

export function Header() {
    const pathname = usePathname();
    const headerRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const indicatorRef = useRef<HTMLSpanElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    // Animation d'entrée avec useGSAP
    useGSAP(
        () => {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            if (prefersReducedMotion) return;

            gsap.fromTo(
                logoRef.current,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
            );

            const links = navRef.current?.querySelectorAll("a");
            if (links) {
                gsap.fromTo(
                    links,
                    { opacity: 0, y: -10 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        stagger: 0.08,
                        ease: "power2.out",
                        delay: 0.2,
                    }
                );
            }
        },
        { scope: headerRef }
    );

    // Indicateur animé sur le lien actif
    useGSAP(
        () => {
            if (!navRef.current || !indicatorRef.current) return;

            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            const activeLink = navRef.current.querySelector(
                "a.active"
            ) as HTMLElement;

            if (activeLink) {
                gsap.to(indicatorRef.current, {
                    x: activeLink.offsetLeft,
                    width: activeLink.offsetWidth,
                    duration: prefersReducedMotion ? 0 : 0.3,
                    ease: "power2.out",
                });
            }
        },
        { scope: headerRef, dependencies: [pathname] }
    );

    // Animation menu mobile
    useGSAP(
        () => {
            if (!mobileMenuRef.current) return;

            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            if (mobileOpen) {
                gsap.fromTo(
                    mobileMenuRef.current,
                    { height: 0, opacity: 0 },
                    {
                        height: "auto",
                        opacity: 1,
                        duration: prefersReducedMotion ? 0 : 0.3,
                        ease: "power2.out",
                    }
                );

                if (!prefersReducedMotion) {
                    const links = mobileMenuRef.current.querySelectorAll("a");
                    gsap.fromTo(
                        links,
                        { opacity: 0, x: -15 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.25,
                            stagger: 0.05,
                            delay: 0.1,
                        }
                    );
                }
            } else {
                gsap.to(mobileMenuRef.current, {
                    height: 0,
                    opacity: 0,
                    duration: prefersReducedMotion ? 0 : 0.2,
                    ease: "power2.in",
                });
            }
        },
        { scope: headerRef, dependencies: [mobileOpen] }
    );

    const handleLogoHover = (enter: boolean) => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        const img = logoRef.current?.querySelector("img");
        if (!img) return;

        gsap.to(img, {
            scale: enter ? 1.1 : 1,
            duration: 0.25,
            ease: "power2.out",
        });
    };

    return (
        <>
            <SkipLink />
            <header
                ref={headerRef}
                className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-md"
                role="banner"
            >
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div ref={logoRef}>
                        <Link
                            href="/"
                            onMouseEnter={() => handleLogoHover(true)}
                            onMouseLeave={() => handleLogoHover(false)}
                            className="flex items-center gap-3"
                            aria-label="Jessy David - Accueil"
                        >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden ring-1 ring-slate-700/50 hover:ring-cyan-500/50 transition-shadow">
                                <Image
                                    src="/logo.webp"
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="font-semibold text-slate-100 text-sm">
                                    Jessy David
                                </span>
                                <span className="font-mono text-slate-500 text-xs">
                                    tutos.jessy-david.dev
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav
                        ref={navRef}
                        className="hidden md:flex items-center relative"
                        aria-label="Navigation principale"
                    >
                        {/* Indicateur animé */}
                        <span
                            ref={indicatorRef}
                            className="absolute bottom-0 h-0.5 bg-cyan-400 rounded-full pointer-events-none"
                            style={{ width: 0 }}
                            aria-hidden="true"
                        />

                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.href}
                                link={link}
                                isActive={isActive(link.href)}
                            />
                        ))}
                    </nav>

                    {/* Mobile Button */}
                    <button
                        onClick={() => setMobileOpen((prev) => !prev)}
                        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                        aria-label={
                            mobileOpen ? "Fermer le menu" : "Ouvrir le menu"
                        }
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-menu"
                        type="button"
                    >
                        <span
                            className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-200 ${
                                mobileOpen ? "rotate-45 translate-y-2" : ""
                            }`}
                            aria-hidden="true"
                        />
                        <span
                            className={`block w-5 h-0.5 bg-current rounded-full transition-opacity duration-200 ${
                                mobileOpen ? "opacity-0" : ""
                            }`}
                            aria-hidden="true"
                        />
                        <span
                            className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-200 ${
                                mobileOpen ? "-rotate-45 -translate-y-2" : ""
                            }`}
                            aria-hidden="true"
                        />
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    id="mobile-menu"
                    ref={mobileMenuRef}
                    className="md:hidden overflow-hidden border-t border-slate-800/50"
                    style={{ height: 0, opacity: 0 }}
                    aria-hidden={!mobileOpen}
                >
                    <nav
                        className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-1"
                        aria-label="Navigation mobile"
                    >
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.href}
                                link={link}
                                isActive={isActive(link.href)}
                                onClick={() => setMobileOpen(false)}
                                mobile
                            />
                        ))}
                    </nav>
                </div>
            </header>
        </>
    );
}
