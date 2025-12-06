import { LogoutButton } from "@/components/ui/LogoutButton";
import { auth } from "@/lib/auth";
import { deleteTutorial, getAllTutorials } from "@/lib/tutorials";
import {
    CalendarDaysOutlined,
    PenToSquareOutlined,
    PlusOutlined,
    Trash3Outlined,
} from "@lineiconshq/free-icons";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function handleDelete(formData: FormData) {
    "use server";

    const session = await auth();
    if (!session) {
        throw new Error("Non autorisé");
    }

    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID manquant");

    await deleteTutorial(id);

    revalidatePath("/dashboard");
    revalidatePath("/");
}

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const tutorials = await getAllTutorials();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        <span className="bg-linear-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                            Tutoriels
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 font-mono">
                        {tutorials.length} tutoriel
                        {tutorials.length > 1 ? "s" : ""}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/nouveau"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm
                                   bg-cyan-500/20 text-cyan-400 border border-cyan-500/40
                                   hover:border-cyan-400/80 hover:text-cyan-300 transition-colors"
                    >
                        <Lineicons icon={PlusOutlined} size={16} />
                        Nouveau tutoriel
                    </Link>
                    <LogoutButton />
                </div>
            </div>

            {/* Liste */}
            {tutorials.length === 0 ? (
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                        <Lineicons
                            icon={PlusOutlined}
                            size={32}
                            className="text-slate-600"
                        />
                    </div>
                    <p className="text-slate-500 font-mono mb-4">
                        Aucun tutoriel pour l&apos;instant
                    </p>
                </div>
            ) : (
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-800/50 border-b border-slate-700/50 text-xs font-mono text-slate-500 uppercase tracking-wider">
                        <div className="col-span-5">Titre</div>
                        <div className="col-span-2">Catégorie</div>
                        <div className="col-span-2">Difficulté</div>
                        <div className="col-span-1">Date</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Table body */}
                    <div className="divide-y divide-slate-800/50">
                        {tutorials.map((tuto) => (
                            <div
                                key={tuto.id}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-800/30 transition-colors group"
                            >
                                <div className="col-span-5">
                                    <Link
                                        href={`/tutos/${tuto.slug}`}
                                        className="text-slate-100 hover:text-cyan-400 transition-colors font-medium"
                                    >
                                        {tuto.title}
                                    </Link>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                                        /{tuto.slug}
                                    </p>
                                </div>

                                <div className="col-span-2">
                                    <span
                                        className="px-2 py-1 text-xs font-mono rounded border"
                                        style={{
                                            backgroundColor: `${tuto.category.color}20`,
                                            borderColor: `${tuto.category.color}40`,
                                            color: tuto.category.color,
                                        }}
                                    >
                                        {tuto.category.name}
                                    </span>
                                </div>

                                <div className="col-span-2">
                                    <DifficultyBadge level={tuto.difficulty} />
                                </div>

                                <div className="col-span-1 flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                                    <Lineicons
                                        icon={CalendarDaysOutlined}
                                        size={14}
                                        className="text-slate-600"
                                    />
                                    {new Date(tuto.date).toLocaleDateString(
                                        "fr-FR",
                                        {
                                            day: "2-digit",
                                            month: "2-digit",
                                        }
                                    )}
                                </div>

                                <div className="col-span-2 flex items-center justify-end gap-2">
                                    <Link
                                        href={`/dashboard/editer/${tuto.id}`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded
                                                   bg-slate-800/60 border border-slate-700/70 text-slate-400
                                                   hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                                    >
                                        <Lineicons
                                            icon={PenToSquareOutlined}
                                            size={14}
                                        />
                                        Éditer
                                    </Link>
                                    <form action={handleDelete}>
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={tuto.id}
                                        />
                                        <button
                                            type="submit"
                                            className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 text-xs font-mono rounded
                                                       bg-slate-800/60 border border-slate-700/70 text-slate-400
                                                       hover:border-rose-500/50 hover:text-rose-400 transition-colors"
                                        >
                                            <Lineicons
                                                icon={Trash3Outlined}
                                                size={14}
                                            />
                                            Supprimer
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function DifficultyBadge({ level }: { level: string }) {
    const colors: Record<string, string> = {
        Débutant: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        Intermédiaire: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        Avancé: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    };

    return (
        <span
            className={`px-2 py-1 text-xs font-mono border rounded ${
                colors[level] || colors["Débutant"]
            }`}
        >
            {level}
        </span>
    );
}
