import type { Tutorial } from "@/lib/tutorials";
import { TutorialCard } from "./TutorialCard";

interface TutorialsGridProps {
    tutorials: Tutorial[];
}

export function TutorialsGrid({ tutorials }: TutorialsGridProps) {
    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
            {tutorials.length === 0 ? (
                <p className="text-slate-500 text-sm font-mono text-center">
                    Aucun tutoriel pour l&apos;instant.
                </p>
            ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {tutorials.map((tutorial) => (
                        <TutorialCard key={tutorial.id} tutorial={tutorial} />
                    ))}
                </div>
            )}
        </section>
    );
}
