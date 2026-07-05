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
    const images: ProjectImage[] = [];
    const markdownImagePattern = /!\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/g;
    const obsidianImagePattern = /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

    for (const match of content.matchAll(markdownImagePattern)) {
        const source = match[2] ?? match[3];

        if (source) {
            images.push({
                alt: match[1] || imageAlt(source),
                src: resolveImageSource(source, noteDirectory),
            });
        }
    }

    for (const match of content.matchAll(obsidianImagePattern)) {
        const source = match[1];

        if (source) {
            images.push({
                alt: match[2] || imageAlt(source),
                src: resolveImageSource(source, noteDirectory),
            });
        }
    }

    return images;
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
