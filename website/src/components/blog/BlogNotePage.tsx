import { type CSSProperties } from "react";

import { type ParsedNote } from "@/lib/blog";
import { arabicTextProps, containsArabic } from "@/lib/arabic";

import Breadcrumbs from "./Breadcrumbs";
import MarkdownContent from "./MarkdownContent";

export default function BlogNotePage({
    note,
    parentSlug,
}: {
    note: ParsedNote;
    parentSlug: string[];
}) {
    return (
        <main
            className="-mx-4 min-h-screen px-10 py-12 md:-ml-[10vw] md:mr-0 md:pl-[calc(10vw+1.5rem)] md:pr-6"
            style={getNoteStyles(note)}
        >
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
    return (
        <header className="mb-10">
            <h1
                className={`font-bold ${containsArabic(note.title) ? "text-[2.3625rem]" : "text-4xl"}`}
                {...arabicTextProps(note.title)}
            >
                {note.title}
            </h1>

            {note.date && (
                <time className="mt-4 block text-sm opacity-70">
                    {note.date}
                </time>
            )}
        </header>
    );
}
