import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

const ALLOWED_ADMIN_IDS = process.env.ALLOWED_DISCORD_IDS?.split(",") || [];

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "identify",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ account }) {
            if (account?.provider === "discord") {
                const discordId = account.providerAccountId;
                if (!ALLOWED_ADMIN_IDS.includes(discordId)) {
                    return "/login?error=unauthorized";
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            if (token.discordId) {
                session.user.discordId = token.discordId as string;
            }
            return session;
        },
        async jwt({ token, account }) {
            if (account?.provider === "discord") {
                token.discordId = account.providerAccountId;
            }
            return token;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
});

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            discordId?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}
