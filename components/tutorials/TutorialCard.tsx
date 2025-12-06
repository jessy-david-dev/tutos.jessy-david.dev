import type { Tutorial } from "@/lib/tutorials";
import Link from "next/link";
import { DifficultyBadge } from "./DifficultyBadge";

interface TutorialCardProps {
    tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
    return (
        <Link
            href={`/tutos/${tutorial.slug}`}
            className="group relative block h-full"
        >
            <div className="absolute -inset-px bg-linear-to-r from-cyan-500/20 via-violet-500/20 to-fuchsia-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <article className="relative h-full flex flex-col bg-slate-900/80 border border-slate-700/50 rounded-lg p-6 hover:border-slate-600/50 transition-all duration-300">
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/50">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-slate-500 text-xs font-mono ml-2 truncate">
                        ~/tutos/{tutorial.slug}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span
                            className="font-mono text-sm px-2 py-0.5 rounded border"
                            style={{
                                backgroundColor: `${tutorial.category.color}20`,
                                borderColor: `${tutorial.category.color}40`,
                                color: tutorial.category.color,
                            }}
                        >
                            {tutorial.category.name}
                        </span>
                        <DifficultyBadge level={tutorial.difficulty} />
                    </div>

                    <h3 className="text-xl font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {tutorial.title}
                    </h3>

                    <p className="flex-1 text-slate-400 text-sm leading-relaxed line-clamp-3">
                        {tutorial.excerpt}
                    </p>

                    <div className="flex items-center gap-4 pt-2 text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            {new Date(tutorial.date).toLocaleDateString(
                                "fr-FR",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }
                            )}
                        </span>
                        {tutorial.readTime && (
                            <span className="flex items-center gap-1">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {tutorial.readTime}
                            </span>
                        )}
                    </div>
                </div>

                {/* Hover prompt */}
                <div className="mt-4 pt-3 border-t border-slate-700/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300 text-sm font-medium">
                            Commencer la lecture
                        </span>
                        <svg
                            className="w-5 h-5 text-cyan-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </div>
                    <div className="h-0.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full w-0 group-hover:w-full bg-linear-to-r from-cyan-500 to-violet-500 transition-all duration-700 ease-out"></div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
