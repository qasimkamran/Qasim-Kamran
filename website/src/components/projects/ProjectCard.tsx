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

                {project.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Project tags">
                        {project.tags.map((tag) => (
                            <li
                                key={tag}
                                className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-xs text-purple-100"
                            >{tag}</li>
                        ))}
                    </ul>
                )}
            </div>

            {project.images.length > 0 && (
                <div className="grid gap-1 border-t border-white/10">
                    {project.images.map((image) => (
                        // The image source can be a Blog asset or an external Markdown URL.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={image.src}
                            src={image.src}
                            alt={image.alt}
                            className="h-auto max-h-96 w-full object-cover"
                        />
                    ))}
                </div>
            )}
        </article>
    );
}
