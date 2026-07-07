import path from "node:path";

import projectsData from "@/data/projects.json";
import { getNote, toSlugSegment } from "@/lib/blog";

export type ProjectImage = {
    alt: string;
    src: string;
};

export type Project = {
    title: string;
    stack: string[];
    description?: string;
    tags: string[];
    href: string;
    images: ProjectImage[];
};

type ProjectConfig = {
    title: string;
    stack: string[];
};

const projectConfigs: ProjectConfig[] = projectsData;

export async function getProjects(): Promise<Project[]> {
    return Promise.all(projectConfigs.map(async (project) => {
        const noteSlug = ["projects", toSlugSegment(project.title)];
        const note = await getNote(noteSlug, { includeUnpublished: true });

        return {
            ...project,
            description: note?.description,
            tags: note?.tags ?? [],
            href: `/blog/${noteSlug.join("/")}`,
            images: note ? extractProjectImages(note.content, "Projects") : [],
        };
    }));
}

function extractProjectImages(
    content: string,
    noteDirectory: string,
): ProjectImage[] {
    const images: Array<ProjectImage & { index: number }> = [];
    const markdownImagePattern = /!\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/g;
    const obsidianImagePattern = /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

    for (const match of content.matchAll(markdownImagePattern)) {
        const source = match[2] ?? match[3];

        if (source && isProjectCardImage(source)) {
            images.push({
                alt: match[1] || imageAlt(source),
                index: match.index,
                src: resolveImageSource(source, noteDirectory),
            });
        }
    }

    for (const match of content.matchAll(obsidianImagePattern)) {
        const source = match[1];

        if (source && isProjectCardImage(source)) {
            images.push({
                alt: match[2] || imageAlt(source),
                index: match.index,
                src: resolveImageSource(source, noteDirectory),
            });
        }
    }

    return images
        .sort((a, b) => a.index - b.index)
        .slice(0, 1)
        .map((image) => ({
            alt: image.alt,
            src: image.src,
        }));
}

function resolveImageSource(source: string, noteDirectory: string): string {
    if (/^https?:\/\//i.test(source) || source.startsWith("/"))
        return source;

    const relativePath = path.posix.normalize(
        path.posix.join(noteDirectory, decodeUrlComponent(source)),
    );

    return `/api/blog-assets?path=${encodeURIComponent(relativePath)}`;
}

function decodeUrlComponent(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function imageAlt(source: string): string {
    return path.posix.basename(source).replace(/\.[^.]+$/, "");
}

function isProjectCardImage(source: string): boolean {
    const extension = source
        .split(/[?#]/, 1)[0]
        .match(/\.([a-z0-9]+)$/i)?.[1]
        ?.toLowerCase();

    if (!extension)
        return true;

    return ["gif", "jpeg", "jpg", "png", "svg", "webp"].includes(extension);
}
