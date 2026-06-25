import Link from "next/link";

import {
  type BlogDirectory,
  type BlogNote,
  type DirectoryContents,
} from "@/lib/blog";

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

      <h1 className="mb-8 text-4xl font-bold capitalize">
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
      className="rounded-lg border p-4 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
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
    <article className="rounded-lg border p-5">
      <Link
        href={`/blog/${note.slug.join("/")}`}
        className="text-xl font-semibold hover:underline"
      >
        {note.title}
      </Link>

      {note.description && (
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {note.description}
        </p>
      )}

      <TagList tags={note.tags} />
    </article>
  );
}

function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-neutral-100 px-2 py-1 text-xs dark:bg-neutral-800"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
