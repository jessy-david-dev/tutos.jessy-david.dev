"use server";

import { signIn } from "@/lib/auth";

export async function loginWithDiscord() {
    await signIn("discord", { redirectTo: "/dashboard" });
}
