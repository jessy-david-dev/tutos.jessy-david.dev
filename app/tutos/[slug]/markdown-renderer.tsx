"use client";

type MarkdownRendererProps = {
    content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const renderMarkdown = (md: string): string => {
        const lines = md.split("\n");
        const result: string[] = [];
        let inCodeBlock = false;
        let codeBlockLang = "";
        let codeBlockContent: string[] = [];
        let inList = false;
        let listType: "ul" | "ol" | null = null;

        const escapeHtml = (text: string): string => {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        };

        const processInline = (text: string): string => {
            let processed = text;

            // Inline code (avant les autres pour éviter les conflits)
            processed = processed.replace(
                /`([^`]+)`/g,
                '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400 text-sm font-mono">$1</code>'
            );

            // Bold
            processed = processed.replace(
                /\*\*([^*]+)\*\*/g,
                '<strong class="font-semibold text-slate-100">$1</strong>'
            );

            // Italic
            processed = processed.replace(
                /\*([^*]+)\*/g,
                '<em class="italic">$1</em>'
            );

            // Links
            processed = processed.replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                '<a href="$2" class="text-cyan-400 hover:text-cyan-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>'
            );

            // Images
            processed = processed.replace(
                /!\[([^\]]*)\]\(([^)]+)\)/g,
                '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />'
            );

            return processed;
        };

        const closeList = () => {
            if (inList && listType) {
                result.push(listType === "ul" ? "</ul>" : "</ol>");
                inList = false;
                listType = null;
            }
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Code block start/end
            if (line.trim().startsWith("```")) {
                if (!inCodeBlock) {
                    closeList();
                    inCodeBlock = true;
                    codeBlockLang = line.trim().slice(3).trim() || "text";
                    codeBlockContent = [];
                } else {
                    // End code block
                    const code = escapeHtml(codeBlockContent.join("\n"));
                    result.push(`
                        <div class="relative my-6">
                            <div class="absolute top-0 right-0 px-3 py-1 text-xs font-mono text-slate-500 bg-slate-800/80 rounded-bl-lg rounded-tr-lg">${codeBlockLang}</div>
                            <pre class="bg-slate-900 border border-slate-700/50 rounded-lg p-4 overflow-x-auto"><code class="text-sm font-mono text-emerald-400 leading-relaxed">${code}</code></pre>
                        </div>
                    `);
                    inCodeBlock = false;
                    codeBlockLang = "";
                    codeBlockContent = [];
                }
                continue;
            }

            // Inside code block
            if (inCodeBlock) {
                codeBlockContent.push(line);
                continue;
            }

            const trimmedLine = line.trim();

            // Empty line
            if (!trimmedLine) {
                closeList();
                continue;
            }

            // Headers
            if (trimmedLine.startsWith("#### ")) {
                closeList();
                result.push(
                    `<h4 class="text-base font-semibold text-slate-100 mt-6 mb-2">${processInline(
                        escapeHtml(trimmedLine.slice(5))
                    )}</h4>`
                );
                continue;
            }
            if (trimmedLine.startsWith("### ")) {
                closeList();
                result.push(
                    `<h3 class="text-lg font-semibold text-slate-100 mt-8 mb-3">${processInline(
                        escapeHtml(trimmedLine.slice(4))
                    )}</h3>`
                );
                continue;
            }
            if (trimmedLine.startsWith("## ")) {
                closeList();
                result.push(
                    `<h2 class="text-xl font-semibold text-slate-100 mt-10 mb-4 pb-2 border-b border-slate-700/50">${processInline(
                        escapeHtml(trimmedLine.slice(3))
                    )}</h2>`
                );
                continue;
            }
            if (trimmedLine.startsWith("# ")) {
                closeList();
                result.push(
                    `<h1 class="text-2xl font-bold text-slate-100 mt-10 mb-6">${processInline(
                        escapeHtml(trimmedLine.slice(2))
                    )}</h1>`
                );
                continue;
            }

            // Horizontal rule
            if (
                trimmedLine === "---" ||
                trimmedLine === "***" ||
                trimmedLine === "___"
            ) {
                closeList();
                result.push('<hr class="my-8 border-slate-700/50" />');
                continue;
            }

            // Blockquote
            if (trimmedLine.startsWith("> ")) {
                closeList();
                result.push(
                    `<blockquote class="border-l-4 border-cyan-500/50 pl-4 my-4 text-slate-400 italic">${processInline(
                        escapeHtml(trimmedLine.slice(2))
                    )}</blockquote>`
                );
                continue;
            }

            // Unordered list
            if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
                if (!inList || listType !== "ul") {
                    closeList();
                    result.push('<ul class="my-4 space-y-1">');
                    inList = true;
                    listType = "ul";
                }
                result.push(
                    `<li class="ml-6 list-disc text-slate-300">${processInline(
                        escapeHtml(trimmedLine.slice(2))
                    )}</li>`
                );
                continue;
            }

            // Ordered list
            const orderedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
            if (orderedMatch) {
                if (!inList || listType !== "ol") {
                    closeList();
                    result.push('<ol class="my-4 space-y-1">');
                    inList = true;
                    listType = "ol";
                }
                result.push(
                    `<li class="ml-6 list-decimal text-slate-300">${processInline(
                        escapeHtml(orderedMatch[2])
                    )}</li>`
                );
                continue;
            }

            // Regular paragraph
            closeList();
            result.push(
                `<p class="text-slate-300 my-4 leading-relaxed">${processInline(
                    escapeHtml(trimmedLine)
                )}</p>`
            );
        }

        // Close any remaining list
        closeList();

        // Close any unclosed code block
        if (inCodeBlock && codeBlockContent.length > 0) {
            const code = escapeHtml(codeBlockContent.join("\n"));
            result.push(`
                <div class="relative my-6">
                    <div class="absolute top-0 right-0 px-3 py-1 text-xs font-mono text-slate-500 bg-slate-800/80 rounded-bl-lg rounded-tr-lg">${codeBlockLang}</div>
                    <pre class="bg-slate-900 border border-slate-700/50 rounded-lg p-4 overflow-x-auto"><code class="text-sm font-mono text-emerald-400 leading-relaxed">${code}</code></pre>
                </div>
            `);
        }

        return result.join("\n");
    };

    return (
        <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
    );
}
