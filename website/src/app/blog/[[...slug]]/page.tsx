import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidElement, type ReactNode } from "react";
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1
                  className={`mb-6 mt-10 text-4xl font-bold first:mt-0 ${rtlClassName(children)}`}
                  dir={textDirection(children)}
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2
                  className={`mb-4 mt-8 text-3xl font-semibold first:mt-0 ${rtlClassName(children)}`}
                  dir={textDirection(children)}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  className={`mb-3 mt-6 text-2xl font-semibold first:mt-0 ${rtlClassName(children)}`}
                  dir={textDirection(children)}
                >
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4
                  className={`mb-2 mt-5 text-xl font-semibold first:mt-0 ${rtlClassName(children)}`}
                  dir={textDirection(children)}
                >
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p
                  className={`my-4 leading-7 ${rtlClassName(children)}`}
                  dir={textDirection(children)}
                >
                  {children}
                </p>
              ),
              li: ({ children }) => (
                <li
                  className={rtlClassName(children)}
                  dir={textDirection(children)}
                >
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote
                  className={`my-6 border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300 ${
                    containsArabicText(children)
                      ? "!border-l-0 !border-r-4 !pl-0 !pr-4 text-right"
                      : "!border-l-4 !border-r-0 !pl-4 !pr-0"
                  }`}
                  dir={textDirection(children)}
                >
                  {children}
                </blockquote>
              ),
            }}
          >
            {note.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}

function containsArabicText(value: ReactNode): boolean {
  if (typeof value === "string") {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(value);
  }

  if (Array.isArray(value)) {
    return value.some(containsArabicText);
  }

  if (isValidElement<{ children?: ReactNode }>(value)) {
    return containsArabicText(value.props.children);
  }

  return false;
}

function textDirection(value: ReactNode) {
  return containsArabicText(value) ? "rtl" : undefined;
}

function rtlClassName(value: ReactNode) {
  return containsArabicText(value) ? "text-right" : "";
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
