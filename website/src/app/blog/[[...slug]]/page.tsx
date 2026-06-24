import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getDirectoryContents, getNote } from "@/lib/blog";

type BlogPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export const dynamic = "force-dynamic";

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug = [] } = await params;

  /*
   * A path may represent either a directory or a Markdown note.
   */
  const directory = await getDirectoryContents(slug);

  if (directory) {
    const currentName =
      slug.length === 0 ? "Blog" : decodeURIComponent(slug.at(-1) ?? "Blog");

    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Breadcrumbs slug={slug} />

        <h1 className="mb-8 text-4xl font-bold capitalize">
          {currentName.replaceAll("-", " ")}
        </h1>

        {directory.directories.length === 0 && directory.notes.length === 0 ? (
          <p className="text-neutral-500">This folder is empty.</p>
        ) : (
          <div className="space-y-10">
            {directory.directories.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-semibold">Folders</h2>

                <div className="grid gap-3 sm:grid-cols-2">
                  {directory.directories.map((folder) => (
                    <Link
                      key={folder.slug.join("/")}
                      href={`/blog/${folder.slug.join("/")}`}
                      className="rounded-lg border p-4 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    >
                      <span aria-hidden="true">📁</span> {folder.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {directory.notes.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-semibold">Notes</h2>

                <div className="space-y-3">
                  {directory.notes.map((note) => (
                    <article
                      key={note.slug.join("/")}
                      className="rounded-lg border p-5"
                    >
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

                      {note.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-neutral-100 px-2 py-1 text-xs dark:bg-neutral-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    );
  }

  const note = await getNote(slug);

  if (!note) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumbs slug={slug.slice(0, -1)} />

      <article>
        <header className="mb-10">
          <h1 className="text-4xl font-bold">{note.title}</h1>

          {note.description && (
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              {note.description}
            </p>
          )}

          {note.date && (
            <time className="mt-4 block text-sm text-neutral-500">
              {note.date}
            </time>
          )}
        </header>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}

function Breadcrumbs({ slug }: { slug: string[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap gap-2 text-sm text-neutral-500"
    >
      <Link href="/blog" className="hover:underline">
        Blog
      </Link>

      {slug.map((segment, index) => {
        const target = slug.slice(0, index + 1).join("/");

        return (
          <span key={target} className="flex gap-2">
            <span aria-hidden="true">/</span>

            <Link
              href={`/blog/${target}`}
              className="capitalize hover:underline"
            >
              {segment.replaceAll("-", " ")}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
