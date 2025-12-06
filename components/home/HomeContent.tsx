"use client";
import { BackgroundEffects } from "@/components/layout";
import {
    CategoryFilters,
    TutorialsGrid,
    type Category,
} from "@/components/tutorials";
import { HeroSection } from "@/components/ui";
import type { Tutorial } from "@/lib/tutorials";
import gsap from "gsap";
import { useEffect, useRef } from "react";

interface HomeContentProps {
    tutorials: Tutorial[];
    categories: Category[];
    allTutorialsCount: number;
}

export function HomeContent({
    tutorials,
    categories,
    allTutorialsCount,
}: HomeContentProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Hero section fade in + slide up
            tl.fromTo(
                heroRef.current,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 }
            );

            // Filters stagger in
            tl.fromTo(
                filtersRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                "-=0.4"
            );

            // Grid cards stagger in
            const cards = gridRef.current?.querySelectorAll("article");
            if (cards && cards.length > 0) {
                tl.fromTo(
                    cards,
                    { y: 50, opacity: 0, scale: 0.95 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: "back.out(1.2)",
                    },
                    "-=0.3"
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, [tutorials]);

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30"
        >
            <BackgroundEffects />
            <div className="relative z-10">
                <div ref={heroRef} className="opacity-0">
                    <HeroSection
                        tutorialsCount={allTutorialsCount}
                        categoriesCount={categories.length}
                    />
                </div>
                <div ref={filtersRef} className="opacity-0">
                    <CategoryFilters categories={categories} />
                </div>
                <div ref={gridRef}>
                    <TutorialsGrid tutorials={tutorials} />
                </div>
            </div>
        </div>
    );
}
