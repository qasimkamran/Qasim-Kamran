import { type CSSProperties } from "react";

import { type ParsedNote } from "@/lib/blog";
import { arabicTextProps, containsArabic } from "@/lib/arabic";

import Breadcrumbs from "./Breadcrumbs";
import MarkdownContent from "../MarkdownContent";
import SiteBackgroundSync from "../SiteBackgroundSync";

export default function BlogNotePage({
    note,
    parentSlug,
}: {
    note: ParsedNote;
    parentSlug: string[];
}) {
    return (
        <main
            className="-mx-4 min-h-screen px-10 py-12 md:-ml-[5vw] md:mr-0 md:pl-[calc(5vw+1.5rem)] md:pr-6"
            style={getNoteStyles(note)}
        >
            <SiteBackgroundSync background={note.background} />
            <div className="w-full max-w-3xl">
                <Breadcrumbs slug={parentSlug} />

                <article>
                    <NoteHeader note={note} />
                    <MarkdownContent content={note.content} />
                </article>
            </div>
        </main>
    );
}

function getNoteStyles(note: ParsedNote): CSSProperties {
    return {
        backgroundColor: note.background,
        color: note.foreground,
    };
}

function NoteHeader({ note }: { note: ParsedNote }) {
    const isProjectNote = note.slug[0] === "projects";
    const githubUrl = note.slug[0] === "projects"
        ? getExternalUrl(note.github)
        : undefined;
    const demoAnchor = isProjectNote
        ? getDemoAnchor(note.content)
        : undefined;

    return (
        <header className="mb-10">
            <div className="flex items-start gap-4">
                <h1
                    className={`min-w-0 flex-1 font-bold ${containsArabic(note.title) ? "text-[2.3625rem]" : "text-4xl"}`}
                    {...arabicTextProps(note.title)}
                >
                    {note.title}
                </h1>

                {(demoAnchor || githubUrl) && (
                    <div className="ml-auto flex shrink-0 items-center gap-2">
                        {demoAnchor && (
                            <a
                                href={demoAnchor}
                                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                            >
                                Demo
                            </a>
                        )}

                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300"
                            >
                                GitHub
                            </a>
                        )}
                    </div>
                )}
            </div>

            {note.date && (
                <time
                    className="mt-4 block text-sm opacity-70"
                    dateTime={note.date}
                >
                    Last Modified: {note.date}
                </time>
            )}
        </header>
    );
}

function getExternalUrl(value: string | undefined): string | undefined {
    if (!value)
        return undefined;

    try {
        const url = new URL(value);

        if (url.protocol === "https:" || url.protocol === "http:")
            return url.toString();
    } catch {
        return undefined;
    }

    return undefined;
}

function getDemoAnchor(content: string): string | undefined {
    const match = /^##\s+(Demo|Demonstration)\s*$/im.exec(content);

    return match ? `#${slugifyHeading(match[1])}` : undefined;
}

function slugifyHeading(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
