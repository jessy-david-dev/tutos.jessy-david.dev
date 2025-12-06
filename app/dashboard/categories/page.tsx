import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    addCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from "@/lib/tutorials";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const ALLOWED_DISCORD_ID = "281113457833672706";

const PRESET_COLORS = [
    // Bleus & Cyans
    { name: "Cyan", value: "#06b6d4" },
    { name: "Sky", value: "#0ea5e9" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Indigo", value: "#6366f1" },
    // Violets & Roses
    { name: "Violet", value: "#8b5cf6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Fuchsia", value: "#d946ef" },
    { name: "Pink", value: "#ec4899" },
    { name: "Rose", value: "#f43f5e" },
    // Chauds
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Yellow", value: "#eab308" },
    // Verts
    { name: "Lime", value: "#84cc16" },
    { name: "Green", value: "#22c55e" },
    { name: "Emerald", value: "#10b981" },
    { name: "Teal", value: "#14b8a6" },
    // Neutres
    { name: "Slate", value: "#64748b" },
];

async function handleAddCategory(formData: FormData) {
    "use server";

    const session = await auth();
    if (
        !session?.user?.discordId ||
        session.user.discordId !== ALLOWED_DISCORD_ID
    ) {
        throw new Error("Non autorisé");
    }

    const name = formData.get("name")?.toString().trim();
    const color = formData.get("color")?.toString() || "#06b6d4";

    if (!name) {
        throw new Error("Le nom est obligatoire");
    }

    await addCategory(name, color);
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard");
}

async function handleDeleteCategory(formData: FormData) {
    "use server";

    const session = await auth();
    if (
        !session?.user?.discordId ||
        session.user.discordId !== ALLOWED_DISCORD_ID
    ) {
        throw new Error("Non autorisé");
    }

    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID manquant");

    await deleteCategory(id);
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard");
}

async function handleUpdateCategory(formData: FormData) {
    "use server";

    const session = await auth();
    if (
        !session?.user?.discordId ||
        session.user.discordId !== ALLOWED_DISCORD_ID
    ) {
        throw new Error("Non autorisé");
    }

    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString().trim();
    const color = formData.get("color")?.toString();

    if (!id || !name) {
        throw new Error("ID et nom sont obligatoires");
    }

    await updateCategory(id, { name, color });
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard");
}

export default async function CategoriesPage() {
    const categories = await getAllCategories();

    // Compter les tutoriels par catégorie
    const counts = await prisma.tutorial.groupBy({
        by: ["categoryId"],
        _count: {
            _all: true,
        },
    });
    const countMap = new Map(
        counts.map((c: (typeof counts)[number]) => [
            c.categoryId,
            c._count._all,
        ])
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    <span className="bg-linear-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        Catégories
                    </span>
                </h1>
                <p className="text-slate-400 text-sm mt-1 font-mono">
                    {categories.length} catégorie
                    {categories.length > 1 ? "s" : ""}
                </p>
            </div>

            {/* Formulaire d'ajout */}
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">
                    Nouvelle catégorie
                </h2>

                <form
                    action={handleAddCategory}
                    className="flex flex-wrap gap-4 items-end"
                >
                    <div className="flex-1 min-w-[200px] space-y-2">
                        <label className="block text-sm font-mono text-slate-400">
                            Nom
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-2.5 text-sm 
                                       text-slate-100 placeholder:text-slate-500
                                       focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40"
                            placeholder="Next.js, React, DevOps..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-mono text-slate-400">
                            Couleur
                        </label>
                        <div className="flex gap-2">
                            {PRESET_COLORS.map((color) => (
                                <label
                                    key={color.value}
                                    className="cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="color"
                                        value={color.value}
                                        defaultChecked={
                                            color.value === "#06b6d4"
                                        }
                                        className="sr-only peer"
                                    />
                                    <div
                                        className="w-8 h-8 rounded-full border-2 border-transparent 
                                                   peer-checked:border-white peer-checked:ring-2 peer-checked:ring-offset-2 
                                                   peer-checked:ring-offset-slate-900 peer-checked:ring-current
                                                   transition-all"
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-lg font-mono text-sm
                                   bg-cyan-500/20 text-cyan-400 border border-cyan-500/40
                                   hover:border-cyan-400/80 hover:text-cyan-300 transition-colors"
                    >
                        Ajouter
                    </button>
                </form>
            </div>

            {/* Liste des catégories */}
            {categories.length === 0 ? (
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-12 text-center">
                    <p className="text-slate-500 font-mono">
                        Aucune catégorie pour l&apos;instant
                    </p>
                </div>
            ) : (
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg overflow-hidden">
                    <div className="divide-y divide-slate-800/50">
                        {categories.map((cat) => {
                            const tutorialCount =
                                (countMap.get(cat.id) as number) || 0;

                            return (
                                <div
                                    key={cat.id}
                                    className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{
                                                backgroundColor: cat.color,
                                            }}
                                        />
                                        <div>
                                            <span className="text-slate-100 font-medium">
                                                {cat.name}
                                            </span>
                                            <span className="text-slate-500 text-xs font-mono ml-2">
                                                /{cat.slug}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded">
                                            {tutorialCount} tuto
                                            {tutorialCount > 1 ? "s" : ""}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Edit inline (simple) */}
                                        <form
                                            action={handleUpdateCategory}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={cat.id}
                                            />
                                            <input
                                                name="name"
                                                type="text"
                                                defaultValue={cat.name}
                                                className="w-32 rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs 
                                                           text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                                            />
                                            <select
                                                name="color"
                                                defaultValue={cat.color}
                                                className="rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs 
                                                           text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                                            >
                                                {PRESET_COLORS.map((color) => (
                                                    <option
                                                        key={color.value}
                                                        value={color.value}
                                                    >
                                                        {color.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="submit"
                                                className="px-2 py-1 text-xs font-mono rounded
                                                           bg-slate-800/60 border border-slate-700/70 text-slate-400
                                                           hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                                            >
                                                OK
                                            </button>
                                        </form>

                                        {/* Delete */}
                                        <form action={handleDeleteCategory}>
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={cat.id}
                                            />
                                            <button
                                                type="submit"
                                                disabled={tutorialCount > 0}
                                                className="px-2 py-1 text-xs font-mono rounded
                                                           bg-slate-800/60 border border-slate-700/70 text-slate-400
                                                           hover:border-rose-500/50 hover:text-rose-400 transition-colors
                                                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700/70 disabled:hover:text-slate-400"
                                                title={
                                                    tutorialCount > 0
                                                        ? "Impossible de supprimer: des tutoriels utilisent cette catégorie"
                                                        : "Supprimer"
                                                }
                                            >
                                                ✕
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
