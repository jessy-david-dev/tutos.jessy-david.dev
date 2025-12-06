import { prisma } from "./prisma";

export type Difficulty = "Débutant" | "Intermédiaire" | "Avancé";

export type Category = {
    id: string;
    name: string;
    slug: string;
    color: string;
};

export type Tutorial = {
    id: string;
    slug: string;
    title: string;
    categoryId: string;
    category: Category;
    difficulty: Difficulty;
    readTime: string;
    excerpt: string;
    content: string;
    date: string;
    updatedAt: string;
};

export type TutorialInput = {
    slug: string;
    title: string;
    categoryId: string;
    difficulty: Difficulty;
    readTime?: string;
    excerpt?: string;
    content: string;
};

/**
 * Génère un slug à partir d'un titre
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

// ============ TUTORIALS ============

export async function getAllTutorials(): Promise<Tutorial[]> {
    const rows = await prisma.tutorial.findMany({
        orderBy: { date: "desc" },
        include: { category: true },
    });

    return rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        categoryId: row.categoryId,
        category: {
            id: row.category.id,
            name: row.category.name,
            slug: row.category.slug,
            color: row.category.color,
        },
        difficulty: row.difficulty as Difficulty,
        readTime: row.readTime ?? "",
        excerpt: row.excerpt ?? "",
        content: row.content,
        date: row.date.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }));
}

export async function getTutorialBySlug(
    slug: string
): Promise<Tutorial | null> {
    const row = await prisma.tutorial.findUnique({
        where: { slug },
        include: { category: true },
    });

    if (!row) return null;

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        categoryId: row.categoryId,
        category: {
            id: row.category.id,
            name: row.category.name,
            slug: row.category.slug,
            color: row.category.color,
        },
        difficulty: row.difficulty as Difficulty,
        readTime: row.readTime ?? "",
        excerpt: row.excerpt ?? "",
        content: row.content,
        date: row.date.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };
}

export async function getTutorialById(id: string): Promise<Tutorial | null> {
    const row = await prisma.tutorial.findUnique({
        where: { id },
        include: { category: true },
    });

    if (!row) return null;

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        categoryId: row.categoryId,
        category: {
            id: row.category.id,
            name: row.category.name,
            slug: row.category.slug,
            color: row.category.color,
        },
        difficulty: row.difficulty as Difficulty,
        readTime: row.readTime ?? "",
        excerpt: row.excerpt ?? "",
        content: row.content,
        date: row.date.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };
}

export async function addTutorial(data: TutorialInput): Promise<Tutorial> {
    const row = await prisma.tutorial.create({
        data: {
            slug: data.slug,
            title: data.title,
            categoryId: data.categoryId,
            difficulty: data.difficulty,
            readTime: data.readTime || null,
            excerpt: data.excerpt || null,
            content: data.content,
        },
        include: { category: true },
    });

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        categoryId: row.categoryId,
        category: {
            id: row.category.id,
            name: row.category.name,
            slug: row.category.slug,
            color: row.category.color,
        },
        difficulty: row.difficulty as Difficulty,
        readTime: row.readTime ?? "",
        excerpt: row.excerpt ?? "",
        content: row.content,
        date: row.date.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };
}

export async function updateTutorial(
    id: string,
    data: Partial<TutorialInput>
): Promise<Tutorial> {
    const row = await prisma.tutorial.update({
        where: { id },
        data: {
            ...(data.slug && { slug: data.slug }),
            ...(data.title && { title: data.title }),
            ...(data.categoryId && { categoryId: data.categoryId }),
            ...(data.difficulty && { difficulty: data.difficulty }),
            ...(data.readTime !== undefined && {
                readTime: data.readTime || null,
            }),
            ...(data.excerpt !== undefined && {
                excerpt: data.excerpt || null,
            }),
            ...(data.content && { content: data.content }),
        },
        include: { category: true },
    });

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        categoryId: row.categoryId,
        category: {
            id: row.category.id,
            name: row.category.name,
            slug: row.category.slug,
            color: row.category.color,
        },
        difficulty: row.difficulty as Difficulty,
        readTime: row.readTime ?? "",
        excerpt: row.excerpt ?? "",
        content: row.content,
        date: row.date.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };
}

export async function deleteTutorial(id: string): Promise<void> {
    await prisma.tutorial.delete({
        where: { id },
    });
}

// ============ CATEGORIES ============

export async function getAllCategories(): Promise<Category[]> {
    const rows = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        color: row.color,
    }));
}

export async function getCategoryById(id: string): Promise<Category | null> {
    const row = await prisma.category.findUnique({
        where: { id },
    });

    if (!row) return null;

    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        color: row.color,
    };
}

export async function addCategory(
    name: string,
    color?: string
): Promise<Category> {
    const row = await prisma.category.create({
        data: {
            name,
            slug: generateSlug(name),
            color: color || "#06b6d4",
        },
    });

    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        color: row.color,
    };
}

export async function updateCategory(
    id: string,
    data: { name?: string; color?: string }
): Promise<Category> {
    const row = await prisma.category.update({
        where: { id },
        data: {
            ...(data.name && {
                name: data.name,
                slug: generateSlug(data.name),
            }),
            ...(data.color && { color: data.color }),
        },
    });

    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        color: row.color,
    };
}

export async function deleteCategory(id: string): Promise<void> {
    // Vérifier qu'aucun tutoriel n'utilise cette catégorie
    const count = await prisma.tutorial.count({
        where: { categoryId: id },
    });

    if (count > 0) {
        throw new Error(
            `Impossible de supprimer: ${count} tutoriel(s) utilisent cette catégorie`
        );
    }

    await prisma.category.delete({
        where: { id },
    });
}

export async function getCategoryTutorialCount(
    categoryId: string
): Promise<number> {
    return prisma.tutorial.count({
        where: { categoryId },
    });
}
