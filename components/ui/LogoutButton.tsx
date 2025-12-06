"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export function LogoutButton() {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await signOut({ callbackUrl: "/" });
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm
                       bg-rose-500/10 border border-rose-500/30 text-rose-400
                       hover:bg-rose-500/20 hover:border-rose-500/50 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
        >
            {loading ? (
                <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            ) : (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
            )}
            {loading ? "Déconnexion..." : "Se déconnecter"}
        </button>
    );
}
