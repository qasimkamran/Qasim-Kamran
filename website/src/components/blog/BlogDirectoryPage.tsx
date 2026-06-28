import Link from "next/link";

import {
    type BlogDirectory,
    type BlogNote,
    type DirectoryContents,
} from "@/lib/blog";
import {
    arabicClassName,
    arabicTextProps,
    containsArabic,
} from "@/lib/arabic";

import Breadcrumbs from "./Breadcrumbs";

export default function BlogDirectoryPage({
    directory,
    slug,
}: {
    directory: DirectoryContents;
    slug: string[];
}) {
    const currentName =
        slug.length === 0 ? "Blog" : decodeURIComponent(slug.at(-1) ?? "Blog");
    const isEmpty =
        directory.directories.length === 0 && directory.notes.length === 0;

    return (
        <main className="w-full max-w-4xl px-6 py-12">
            <Breadcrumbs slug={slug} />

            <h1
                className={`mb-8 font-bold capitalize ${containsArabic(currentName) ? "text-[2.3625rem]" : "text-4xl"}`}
                {...arabicTextProps(currentName)}
            >
                {currentName.replaceAll("-", " ")}
            </h1>

            {isEmpty ? (
                <p className="text-neutral-500">This folder is empty.</p>
            ) : (
                <div className="space-y-10">
                    <FolderSection directories={directory.directories} />
                    <NotesSection notes={directory.notes} />
                </div>
            )}
        </main>
    );
}

function FolderSection({ directories }: { directories: BlogDirectory[] }) {
    if (directories.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="mb-4 text-xl font-semibold">Folders</h2>

            <div className="grid gap-3 sm:grid-cols-2">
                {directories.map((folder) => (
                    <FolderLink key={folder.slug.join("/")} folder={folder} />
                ))}
            </div>
        </section>
    );
}

function FolderLink({ folder }: { folder: BlogDirectory }) {
    return (
        <Link
            href={`/blog/${folder.slug.join("/")}`}
            className={`block rounded-lg bg-[#2a123f] p-4 text-white transition-colors hover:bg-[#3a1a57] ${arabicClassName(folder.name, "text-[1.05rem]")}`}
            {...arabicTextProps(folder.name)}
        >
            {folder.name}
        </Link>
    );
}

function NotesSection({ notes }: { notes: BlogNote[] }) {
    if (notes.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="mb-4 text-xl font-semibold">Notes</h2>

            <div className="space-y-3">
                {notes.map((note) => (
                    <NoteCard key={note.slug.join("/")} note={note} />
                ))}
            </div>
        </section>
    );
}

function NoteCard({ note }: { note: BlogNote }) {
    return (
        <article className="rounded-lg bg-[#2a123f] p-5 text-white">
            <div className="flex flex-wrap items-center gap-3">
                <Link
                    href={`/blog/${note.slug.join("/")}`}
                    className={`font-semibold hover:underline ${containsArabic(note.title) ? "text-[1.3125rem]" : "text-xl"}`}
                    {...arabicTextProps(note.title)}
                >
                    {note.title}
                </Link>

                <TagList tags={note.tags} />
            </div>

            {note.description && (
                <p
                    className={`mt-2 text-purple-100 ${arabicClassName(note.description, "text-[1.05rem]")}`}
                    {...arabicTextProps(note.description)}
                >
                    {note.description}
                </p>
            )}
        </article>
    );
}

function TagList({ tags }: { tags: string[] }) {
    if (tags.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className={`rounded-full bg-[#3a1a57] px-2 py-1 text-white ${containsArabic(tag) ? "text-[0.7875rem]" : "text-xs"}`}
                    {...arabicTextProps(tag)}
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}
