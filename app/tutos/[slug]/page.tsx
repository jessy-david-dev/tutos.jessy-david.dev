import { BackButton } from "@/components/ui";
import { getTutorialBySlug } from "@/lib/tutorials";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "./markdown-renderer";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const tutorial = await getTutorialBySlug(slug);

    if (!tutorial) {
        return { title: "Tutoriel non trouvé" };
    }

    return {
        title: `${tutorial.title} | Jessy David`,
        description: tutorial.excerpt,
    };
}

export default async function TutorialPage({ params }: Props) {
    const { slug } = await params;
    const tutorial = await getTutorialBySlug(slug);

    if (!tutorial) {
        notFound();
    }

    const difficultyColors = {
        Débutant: "text-emerald-400 border-emerald-500/40",
        Intermédiaire: "text-amber-400 border-amber-500/40",
        Avancé: "text-rose-400 border-rose-500/40",
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
            {/* Effets de fond */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Contenu */}
            <div className="relative z-10 px-6 py-12">
                <article className="max-w-3xl mx-auto">
                    {/* Navigation retour */}
                    <BackButton />

                    {/* Header */}
                    <header className="mb-8 pb-6 border-b border-slate-700/50">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span
                                className="px-2 py-0.5 text-xs font-mono rounded border bg-slate-800/60"
                                style={{
                                    borderColor: `${tutorial.category.color}40`,
                                    color: tutorial.category.color,
                                }}
                            >
                                {tutorial.category.name}
                            </span>
                            <span
                                className={`px-2 py-0.5 text-xs font-mono rounded border bg-slate-800/60 ${
                                    difficultyColors[tutorial.difficulty]
                                }`}
                            >
                                {tutorial.difficulty}
                            </span>
                            <span className="text-xs font-mono text-slate-500">
                                {tutorial.readTime}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="bg-linear-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                {tutorial.title}
                            </span>
                        </h1>

                        <p className="text-slate-400">{tutorial.excerpt}</p>

                        <div className="mt-4 text-xs font-mono text-slate-500">
                            Publié le{" "}
                            {new Date(tutorial.date).toLocaleDateString(
                                "fr-FR",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </div>
                    </header>

                    {/* Contenu Markdown */}
                    <MarkdownRenderer content={tutorial.content} />
                </article>
            </div>
        </div>
    );
}
