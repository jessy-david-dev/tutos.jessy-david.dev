"use client";

import {
    Book1Outlined,
    Folder1Outlined,
    PlusOutlined,
} from "@lineiconshq/free-icons";
import { Lineicons } from "@lineiconshq/react-lineicons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    {
        href: "/dashboard",
        label: "Tutoriels",
        icon: Book1Outlined,
        exact: true,
    },
    {
        href: "/dashboard/nouveau",
        label: "Nouveau",
        icon: PlusOutlined,
    },
    {
        href: "/dashboard/categories",
        label: "Catégories",
        icon: Folder1Outlined,
    },
];

export function DashboardSidebar() {
    const pathname = usePathname();

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-64 min-h-[calc(100vh-65px)] border-r border-slate-800/50 bg-slate-900/30 backdrop-blur-sm sticky top-16">
            <div className="p-4">
                {/* Section title */}
                <div className="px-4 py-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Gestion
                    </span>
                </div>

                {/* Nav items */}
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const active = isActive(item.href, item.exact);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400 ml-[-1px]"
                                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                                }`}
                            >
                                <Lineicons
                                    icon={item.icon}
                                    size={20}
                                    className={`transition-transform duration-200 ${
                                        active ? "" : "group-hover:scale-110"
                                    }`}
                                />
                                <span>{item.label}</span>
                                {active && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div className="my-6 border-t border-slate-800/50" />

                {/* Quick action */}
                <Link
                    href="/dashboard/nouveau"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-slate-100 hover:from-cyan-500/30 hover:to-violet-500/30 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300"
                >
                    <Lineicons icon={PlusOutlined} size={18} />
                    <span>Créer un tuto</span>
                </Link>
            </div>
        </aside>
    );
}
