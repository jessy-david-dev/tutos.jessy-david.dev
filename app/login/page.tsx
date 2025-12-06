import { LoginContent } from "@/components/auth/LoginContent";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Connexion | Jessy David",
    description: "Connexion via Discord pour accéder au dashboard.",
};

type PageProps = {
    searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
    const session = await auth();

    // Déjà connecté -> Redirige vers dashboard
    if (session) {
        redirect("/dashboard");
    }

    const { error } = await searchParams;
    return <LoginContent error={error} />;
}
