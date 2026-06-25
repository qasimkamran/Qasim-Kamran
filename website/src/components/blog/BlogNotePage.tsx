import { type ParsedNote } from "@/lib/blog";

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
        <main className="w-full max-w-3xl px-6 py-12">
            <Breadcrumbs slug={parentSlug} />

            <article>
                <NoteHeader note={note} />
                <MarkdownContent content={note.content} />
            </article>
        </main>
    );
}

function NoteHeader({ note }: { note: ParsedNote }) {
    return (
        <header className="mb-10">
            <h1 className="text-4xl font-bold">{note.title}</h1>

            {note.date && (
                <time className="mt-4 block text-sm text-neutral-500">
                    {note.date}
                </time>
            )}
        </header>
    );
}
