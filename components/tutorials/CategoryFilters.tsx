"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface Category {
    id: string;
    name: string;
    color: string;
}

interface CategoryFiltersProps {
    categories: Category[];
}

export function CategoryFilters({ categories }: CategoryFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category");

    const handleFilter = (categoryId: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId) {
            params.set("category", categoryId);
        } else {
            params.delete("category");
        }
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
            {/* Scroll horizontal sur mobile, wrap sur desktop */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:overflow-visible scrollbar-none">
                <button
                    onClick={() => handleFilter(null)}
                    className={`shrink-0 cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-xs sm:text-sm transition-all border
                        ${
                            !activeCategory
                                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                                : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600/50"
                        }`}
                    type="button"
                >
                    Tous
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleFilter(cat.id)}
                        className={`shrink-0 cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-xs sm:text-sm transition-all border
                            ${
                                activeCategory === cat.id
                                    ? ""
                                    : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50"
                            }`}
                        style={{
                            color: cat.color,
                            backgroundColor:
                                activeCategory === cat.id
                                    ? `${cat.color}20`
                                    : undefined,
                            borderColor:
                                activeCategory === cat.id
                                    ? `${cat.color}50`
                                    : undefined,
                        }}
                        type="button"
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </section>
    );
}
