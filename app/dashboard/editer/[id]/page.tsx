import { auth } from "@/lib/auth";
import {
    generateSlug,
    getAllCategories,
    getTutorialById,
    updateTutorial,
} from "@/lib/tutorials";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TutorialForm } from "../../_components/tutorial-form";

export const dynamic = "force-dynamic";

const ALLOWED_DISCORD_ID = "281113457833672706";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EditTutorialPage({ params }: Props) {
    const { id } = await params;
    const [tutorial, categories] = await Promise.all([
        getTutorialById(id),
        getAllCategories(),
    ]);

    if (!tutorial) {
        notFound();
    }

    // Capture le slug ici pour l'utiliser dans la Server Action
    const tutorialSlug = tutorial.slug;

    async function handleUpdate(formData: FormData) {
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

        await updateTutorial(id, {
            slug: generateSlug(title),
            title,
            categoryId,
            difficulty: difficulty as "Débutant" | "Intermédiaire" | "Avancé",
            readTime: readTime || "5 min",
            excerpt:
                excerpt ||
                (content.length > 180
                    ? content.slice(0, 180) + "..."
                    : content),
            content,
        });

        revalidatePath("/dashboard");
        revalidatePath("/");
        revalidatePath(`/tutos/${tutorialSlug}`);
        redirect("/dashboard");
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        <span className="bg-linear-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                            Éditer le tutoriel
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 font-mono">
                        {tutorial.title}
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

            <TutorialForm
                categories={categories}
                action={handleUpdate}
                submitLabel="Enregistrer les modifications"
                initialData={tutorial}
            />
        </div>
    );
}
