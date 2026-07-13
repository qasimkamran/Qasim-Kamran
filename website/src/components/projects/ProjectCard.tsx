import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 font-mono shadow-lg shadow-black/10">
            <div className="p-6 sm:p-8">
                <header className="flex items-start justify-between gap-6">
                    <h2 className="min-w-0 text-3xl font-semibold text-white">
                        <Link
                            href={project.href}
                            className="transition-colors hover:text-purple-200"
                        >
                            {project.title}
                        </Link>
                    </h2>

                    <ul
                        className="flex flex-wrap justify-end gap-3"
                        aria-label="Technology stack"
                    >
                        {project.stack.map((technology) => (
                            <li
                                key={technology}
                                className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 p-2"
                                title={technology}
                            >
                                <Image
                                    src={`/assets/icons/${encodeURIComponent(technology)}.png`}
                                    alt={`${technology} icon`}
                                    width={40}
                                    height={40}
                                    className="h-8 w-8 object-contain"
                                />
                            </li>
                        ))}
                    </ul>
                </header>

                <p className="mt-6 leading-7 text-purple-100">
                    {project.description ?? "No description provided."}
                </p>

                {(project.tags.length > 0 || project.demoHref || project.githubHref) && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        {project.tags.length > 0 && (
                            <ul
                                className="flex min-w-0 flex-1 flex-wrap gap-2"
                                aria-label="Project tags"
                            >
                                {project.tags.map((tag) => (
                                    <li
                                        key={tag}
                                        className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-xs text-purple-100"
                                    >{tag}</li>
                                ))}
                            </ul>
                        )}

                        {(project.demoHref || project.githubHref) && (
                            <div className="ml-auto flex shrink-0 items-center gap-2">
                                {project.demoHref && (
                                    <Link
                                        href={project.demoHref}
                                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white no-underline transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                                    >
                                        Demo
                                    </Link>
                                )}

                                {project.githubHref && (
                                    <a
                                        href={project.githubHref}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white no-underline transition hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300"
                                    >
                                        GitHub
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {project.media.length > 0 && (
                <div className="grid gap-1 border-t border-white/10">
                    {project.media.map((media) => (
                        media.type === "video" ? (
                            <video
                                key={media.src}
                                muted
                                playsInline
                                preload="metadata"
                                aria-label={media.alt}
                                className="aspect-video max-h-96 w-full object-cover"
                            >
                                <source src={media.src} />
                            </video>
                        ) : (
                            // The image source can be a Blog asset or an external Markdown URL.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                key={media.src}
                                src={media.src}
                                alt={media.alt}
                                className="h-auto max-h-96 w-full object-cover"
                            />
                        )
                    ))}
                </div>
            )}
        </article>
    );
}
