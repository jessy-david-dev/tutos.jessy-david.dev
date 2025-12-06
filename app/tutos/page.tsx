import { BackgroundEffects } from "@/components/layout";
import {
    CategoryFilters,
    TutorialsGrid,
    type Category,
} from "@/components/tutorials";
import { HeroSection } from "@/components/ui";
import { getAllTutorials } from "@/lib/tutorials";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tutos | Jessy David",
    description: "Mes tutoriels",
};

export const dynamic = "force-dynamic";

function extractCategories(
    tutorials: Awaited<ReturnType<typeof getAllTutorials>>
): Category[] {
    const categoriesMap = new Map<string, Category>();
    tutorials.forEach((t) => {
        if (!categoriesMap.has(t.category.id)) {
            categoriesMap.set(t.category.id, {
                id: t.category.id,
                name: t.category.name,
                color: t.category.color,
            });
        }
    });
    return Array.from(categoriesMap.values());
}

type PageProps = {
    searchParams: Promise<{ category?: string }>;
};

export default async function TutosPage({ searchParams }: PageProps) {
    const { category } = await searchParams;
    const allTutorials = await getAllTutorials();
    const categories = extractCategories(allTutorials);

    const tutorials = category
        ? allTutorials.filter((t) => t.category.id === category)
        : allTutorials;

    const activeCategoryName = category
        ? categories.find((c) => c.id === category)?.name
        : null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
            <BackgroundEffects />
            <div className="relative z-10">
                <HeroSection
                    tutorialsCount={tutorials.length}
                    categoriesCount={categories.length}
                    title={activeCategoryName}
                    filtered={!!category}
                />
                <CategoryFilters categories={categories} />
                <TutorialsGrid tutorials={tutorials} />
            </div>
        </div>
    );
}
