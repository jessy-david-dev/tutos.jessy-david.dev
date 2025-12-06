import type { Tutorial } from "@/lib/tutorials";

const colors: Record<string, string> = {
    Débutant: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Intermédiaire: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Avancé: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

interface DifficultyBadgeProps {
    level: Tutorial["difficulty"];
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
    return (
        <span
            className={`px-2 py-0.5 text-xs font-mono border rounded ${colors[level]}`}
        >
            {level}
        </span>
    );
}
