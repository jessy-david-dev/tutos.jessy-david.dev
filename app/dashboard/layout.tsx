import type { Metadata } from "next";
import { DashboardSidebar } from "./_components/DashboardSidebar";

export const metadata: Metadata = {
    title: "Dashboard | Jessy David",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
            {/* Effets de fond */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="relative z-10 flex">
                <DashboardSidebar />

                {/* Main content */}
                <main className="flex-1 p-8">
                    <div className="max-w-5xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
