import { auth } from "@/lib/auth";
import { addTutorial, generateSlug, getAllCategories } from "@/lib/tutorials";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TutorialForm } from "../_components/tutorial-form";

export const dynamic = "force-dynamic";

const ALLOWED_DISCORD_ID = "281113457833672706";

async function createTutorial(formData: FormData) {
    "use server";

    const session = await auth();
    if (
        !session?.user?.discordId ||
        session.user.discordId !== ALLOWED_DISCORD_ID
    ) {
        throw new Error("Non autorisé");
    }

    const title = formData.get("title")?.toString().trim();
    const categoryId = formData.get("categoryId")?.toString();
    const difficulty =
        formData.get("difficulty")?.toString() || "Intermédiaire";
    const readTime = formData.get("readTime")?.toString().trim();
    const excerpt = formData.get("excerpt")?.toString().trim();
    const content = formData.get("content")?.toString().trim();

    if (!title || !categoryId || !content) {
        throw new Error("Titre, catégorie et contenu sont obligatoires.");
    }

    await addTutorial({
        slug: generateSlug(title),
        title,
        categoryId,
        difficulty: difficulty as "Débutant" | "Intermédiaire" | "Avancé",
        readTime: readTime || "5 min",
        excerpt:
            excerpt ||
            (content.length > 180 ? content.slice(0, 180) + "..." : content),
        content,
    });

    revalidatePath("/dashboard");
    revalidatePath("/");
    redirect("/dashboard");
}

export default async function NewTutorialPage() {
    const categories = await getAllCategories();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        <span className="bg-linear-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                            Nouveau tutoriel
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 font-mono">
                        Créez un nouveau tutoriel avec preview Markdown
                    </p>
                </div>

                <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-lg font-mono text-sm
                               bg-slate-800/60 border border-slate-700/70 text-slate-400
                               hover:border-slate-600 hover:text-slate-300 transition-colors"
                >
                    ← Retour
                </Link>
            </div>

            {categories.length === 0 ? (
                <div className="bg-slate-900/80 border border-amber-500/30 rounded-lg p-8 text-center">
                    <p className="text-amber-400 font-mono mb-4">
                        ⚠️ Vous devez d&apos;abord créer au moins une catégorie
                    </p>
                    <Link
                        href="/dashboard/categories"
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                    >
                        Gérer les catégories →
                    </Link>
                </div>
            ) : (
                <TutorialForm
                    categories={categories}
                    action={createTutorial}
                    submitLabel="Créer le tutoriel"
                />
            )}
        </div>
    );
}
