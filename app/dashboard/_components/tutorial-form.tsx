"use client";

import { MarkdownRenderer } from "@/app/tutos/[slug]/markdown-renderer";
import type { Category, Tutorial } from "@/lib/tutorials";
import {
    AlignTextLeftOutlined,
    Books2Outlined,
    CheckCircle1Outlined,
    Code1Outlined,
    EyeOutlined,
    Folder1Outlined,
    KeyboardOutlined,
    Layers1Outlined,
    Pencil1Outlined,
    StopwatchOutlined,
} from "@lineiconshq/free-icons";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { useCallback, useEffect, useRef, useState } from "react";

type TutorialFormProps = {
    categories: Category[];
    action: (formData: FormData) => Promise<void>;
    submitLabel: string;
    initialData?: Partial<Tutorial>;
};

// Wrapper pour simplifier l'utilisation des icônes LineIcons
function Icon({
    icon,
    size = 16,
    className = "",
}: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    size?: number;
    className?: string;
}) {
    return <Lineicons icon={icon} size={size} className={className} />;
}

// Composant pour les labels avec icône
function FormLabel({
    icon,
    children,
    required,
}: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <label className="flex items-center gap-2 text-sm font-mono text-slate-400 mb-2">
            <Icon icon={icon} size={16} className="text-cyan-500/70" />
            <span>{children}</span>
            {required && <span className="text-cyan-500">*</span>}
        </label>
    );
}

// Composant input stylisé
function FormInput({
    className = "",
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`w-full rounded-lg bg-slate-950/80 border border-slate-700/50 px-4 py-2.5 text-sm 
                       text-slate-100 placeholder:text-slate-600
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50
                       hover:border-slate-600 transition-all duration-200
                       backdrop-blur-sm ${className}`}
        />
    );
}

// Composant select stylisé
function FormSelect({
    children,
    className = "",
    ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={`w-full rounded-lg bg-slate-950/80 border border-slate-700/50 px-4 py-2.5 text-sm 
                       text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50
                       hover:border-slate-600 transition-all duration-200
                       backdrop-blur-sm cursor-pointer ${className}`}
        >
            {children}
        </select>
    );
}

// Composant textarea stylisé
function FormTextarea({
    className = "",
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={`w-full rounded-lg bg-slate-950/80 border border-slate-700/50 px-4 py-3 text-sm 
                       text-slate-100 placeholder:text-slate-600
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50
                       hover:border-slate-600 transition-all duration-200
                       backdrop-blur-sm resize-y ${className}`}
        />
    );
}

// Composant carte section
function FormSection({
    title,
    icon,
    children,
    className = "",
    noPadding = false,
}: {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}) {
    return (
        <div
            className={`relative bg-gradient-to-br from-slate-900/90 to-slate-900/70 
                        border border-slate-700/40 rounded-xl overflow-hidden
                        backdrop-blur-md shadow-xl shadow-black/20 ${className}`}
        >
            {/* Effet de brillance en haut */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/40 bg-slate-800/30">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Icon icon={icon} size={16} className="text-cyan-400" />
                </div>
                <h2 className="text-base font-semibold text-slate-100 tracking-wide">
                    {title}
                </h2>
            </div>

            {/* Content */}
            {noPadding ? children : <div className="p-6">{children}</div>}
        </div>
    );
}

export function TutorialForm({
    categories,
    action,
    submitLabel,
    initialData,
}: TutorialFormProps) {
    const [content, setContent] = useState(initialData?.content || "");
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
    const [charCount, setCharCount] = useState(content.length);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Mise à jour du compteur de caractères
    useEffect(() => {
        setCharCount(content.length);
    }, [content]);

    // Estimation du temps de lecture
    const estimatedReadTime = useCallback(() => {
        const words = content.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `~${minutes} min`;
    }, [content]);

    // Raccourcis clavier pour le markdown
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.ctrlKey || e.metaKey) {
                const textarea = textareaRef.current;
                if (!textarea) return;

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selected = content.substring(start, end);

                let newContent = content;
                let newStart = start;
                let newEnd = end;

                switch (e.key) {
                    case "b": // Bold
                        e.preventDefault();
                        newContent =
                            content.substring(0, start) +
                            `**${selected}**` +
                            content.substring(end);
                        newStart = start + 2;
                        newEnd = end + 2;
                        break;
                    case "i": // Italic
                        e.preventDefault();
                        newContent =
                            content.substring(0, start) +
                            `*${selected}*` +
                            content.substring(end);
                        newStart = start + 1;
                        newEnd = end + 1;
                        break;
                    case "k": // Code
                        e.preventDefault();
                        newContent =
                            content.substring(0, start) +
                            `\`${selected}\`` +
                            content.substring(end);
                        newStart = start + 1;
                        newEnd = end + 1;
                        break;
                    default:
                        return;
                }

                setContent(newContent);
                // Restaurer la sélection après le re-render
                requestAnimationFrame(() => {
                    textarea.setSelectionRange(newStart, newEnd);
                });
            }
        },
        [content]
    );

    return (
        <form action={action} className="space-y-8">
            {/* Hidden input pour toujours envoyer le content */}
            <input type="hidden" name="content" value={content} />

            {/* Métadonnées */}
            <FormSection
                title="Informations du tutoriel"
                icon={Folder1Outlined}
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <FormLabel icon={AlignTextLeftOutlined} required>
                            Titre
                        </FormLabel>
                        <FormInput
                            name="title"
                            type="text"
                            required
                            defaultValue={initialData?.title}
                            placeholder="Mon super tutoriel"
                        />
                    </div>

                    <div>
                        <FormLabel icon={Books2Outlined} required>
                            Catégorie
                        </FormLabel>
                        <FormSelect
                            name="categoryId"
                            required
                            defaultValue={initialData?.categoryId}
                        >
                            <option value="">
                                Sélectionner une catégorie...
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </FormSelect>
                    </div>

                    <div>
                        <FormLabel icon={Layers1Outlined}>Difficulté</FormLabel>
                        <FormSelect
                            name="difficulty"
                            defaultValue={
                                initialData?.difficulty || "Intermédiaire"
                            }
                        >
                            <option value="Débutant">🌱 Débutant</option>
                            <option value="Intermédiaire">
                                🌿 Intermédiaire
                            </option>
                            <option value="Avancé">🌳 Avancé</option>
                        </FormSelect>
                    </div>

                    <div>
                        <FormLabel icon={StopwatchOutlined}>
                            Temps de lecture
                        </FormLabel>
                        <div className="relative">
                            <FormInput
                                name="readTime"
                                type="text"
                                defaultValue={initialData?.readTime}
                                placeholder="5 min"
                            />
                            {content.length > 0 && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                                    Estimé: {estimatedReadTime()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <FormLabel icon={AlignTextLeftOutlined}>Extrait</FormLabel>
                    <FormTextarea
                        name="excerpt"
                        rows={2}
                        defaultValue={initialData?.excerpt}
                        placeholder="Courte description qui s'affichera sur la page d'accueil..."
                    />
                    <p className="mt-2 text-xs text-slate-500 font-mono">
                        Laissez vide pour générer automatiquement depuis le
                        contenu
                    </p>
                </div>
            </FormSection>

            {/* Éditeur Markdown */}
            <FormSection title="Contenu" icon={Code1Outlined} noPadding>
                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-slate-700/40 bg-slate-800/20">
                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => setActiveTab("edit")}
                            className={`group flex items-center gap-2 px-6 py-3.5 text-sm font-mono transition-all duration-200 relative ${
                                activeTab === "edit"
                                    ? "text-cyan-400"
                                    : "text-slate-400 hover:text-slate-300"
                            }`}
                        >
                            <span
                                className={`transition-transform duration-200 ${
                                    activeTab === "edit"
                                        ? "scale-110"
                                        : "group-hover:scale-105"
                                }`}
                            >
                                <Icon icon={Pencil1Outlined} size={16} />
                            </span>
                            <span>Éditer</span>
                            {activeTab === "edit" && (
                                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-400" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("preview")}
                            className={`group flex items-center gap-2 px-6 py-3.5 text-sm font-mono transition-all duration-200 relative ${
                                activeTab === "preview"
                                    ? "text-cyan-400"
                                    : "text-slate-400 hover:text-slate-300"
                            }`}
                        >
                            <span
                                className={`transition-transform duration-200 ${
                                    activeTab === "preview"
                                        ? "scale-110"
                                        : "group-hover:scale-105"
                                }`}
                            >
                                <Icon icon={EyeOutlined} size={16} />
                            </span>
                            <span>Aperçu</span>
                            {activeTab === "preview" && (
                                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-400" />
                            )}
                        </button>
                    </div>

                    {/* Statistiques */}
                    <div className="flex items-center gap-4 pr-6 text-xs font-mono text-slate-500">
                        <span>{charCount.toLocaleString()} caractères</span>
                        <span className="text-slate-700">|</span>
                        <span>
                            {content.trim().split(/\s+/).filter(Boolean).length}{" "}
                            mots
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === "edit" ? (
                        <div className="space-y-3">
                            {/* Barre d'outils markdown */}
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                                <Icon
                                    icon={KeyboardOutlined}
                                    size={14}
                                    className="text-slate-500"
                                />
                                <span className="text-xs text-slate-500 font-mono mr-2">
                                    Raccourcis:
                                </span>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-2 py-1 text-xs font-mono bg-slate-700/50 text-slate-300 rounded border border-slate-600/50">
                                        Ctrl+B
                                    </kbd>
                                    <span className="text-slate-600 text-xs">
                                        Gras
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 ml-3">
                                    <kbd className="px-2 py-1 text-xs font-mono bg-slate-700/50 text-slate-300 rounded border border-slate-600/50">
                                        Ctrl+I
                                    </kbd>
                                    <span className="text-slate-600 text-xs">
                                        Italique
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 ml-3">
                                    <kbd className="px-2 py-1 text-xs font-mono bg-slate-700/50 text-slate-300 rounded border border-slate-600/50">
                                        Ctrl+K
                                    </kbd>
                                    <span className="text-slate-600 text-xs">
                                        Code
                                    </span>
                                </div>
                            </div>

                            <textarea
                                ref={textareaRef}
                                rows={20}
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full rounded-lg bg-slate-950/80 border border-slate-700/50 px-4 py-3 text-sm 
                                           font-mono text-slate-100 placeholder:text-slate-600
                                           focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50
                                           hover:border-slate-600 transition-all duration-200
                                           resize-y min-h-[450px] leading-relaxed"
                                placeholder={`# Mon tutoriel

## Introduction

Voici un exemple de contenu en **Markdown**.

## Étapes

1. Première étape
2. Deuxième étape
3. Troisième étape

## Code

\`\`\`typescript
const hello = "world";
console.log(hello);
\`\`\`

## Conclusion

C'est tout pour ce tutoriel !`}
                            />

                            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                                <p>
                                    Supporte le Markdown : titres (#), gras
                                    (**), italique (*), code (`), listes,
                                    citations (&gt;), liens, images...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="min-h-[450px] rounded-lg bg-slate-950/50 border border-slate-700/30 p-6 overflow-auto">
                            {content.trim() ? (
                                <MarkdownRenderer content={content} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                                    <div className="p-4 rounded-full bg-slate-800/50 mb-4">
                                        <Icon
                                            icon={EyeOutlined}
                                            size={32}
                                            className="text-slate-600"
                                        />
                                    </div>
                                    <p className="text-slate-500 font-mono text-sm">
                                        Commencez à écrire pour voir l'aperçu...
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </FormSection>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
                <button
                    type="submit"
                    className="group relative flex items-center gap-3 px-8 py-3.5 rounded-xl font-mono text-sm
                               bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 
                               text-cyan-400 border border-cyan-500/40
                               hover:border-cyan-400/70 hover:text-cyan-300 
                               hover:from-cyan-500/30 hover:to-cyan-600/30
                               hover:shadow-lg hover:shadow-cyan-500/20
                               active:scale-[0.98]
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-300"
                >
                    {/* Effet de brillance */}
                    <span className="absolute inset-0 rounded-xl overflow-hidden">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </span>

                    <span className="relative z-10">
                        <Icon icon={CheckCircle1Outlined} size={20} />
                    </span>
                    <span className="relative z-10">{submitLabel}</span>
                </button>
            </div>
        </form>
    );
}
