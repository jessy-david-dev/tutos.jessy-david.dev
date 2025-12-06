"use client";

import { ArrowLeftOutlined } from "@lineiconshq/free-icons";
import { Lineicons } from "@lineiconshq/react-lineicons";
import Link from "next/link";

export function BackButton() {
    return (
        <Link
            href="/"
            className="group inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg font-mono text-sm
                       bg-slate-800/60 border border-slate-700/70
                       hover:border-cyan-400/60 hover:text-cyan-300 transition-all duration-200"
        >
            <Lineicons
                icon={ArrowLeftOutlined}
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Retour aux tutoriels
        </Link>
    );
}
