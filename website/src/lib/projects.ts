import path from "node:path";

import projectsData from "@/data/projectsData.json";
import { resolveAssetSource } from "@/lib/assets";
import { getNote, toSlugSegment } from "@/lib/blog";

export type ProjectMedia = {
    alt: string;
    src: string;
    type: "image" | "video";
};

export type Project = {
    title: string;
    stack: string[];
    description?: string;
    tags: string[];
    href: string;
    githubHref?: string;
    demoHref?: string;
    media: ProjectMedia[];
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

        const href = `/blog/${noteSlug.join("/")}`;
        const demoAnchor = note ? getDemoAnchor(note.content) : undefined;

        return {
            ...project,
            description: note?.description,
            tags: note?.tags ?? [],
            href,
            githubHref: getExternalUrl(note?.github),
            demoHref: demoAnchor ? `${href}${demoAnchor}` : undefined,
            media: note ? extractProjectMedia(note.content, "Projects") : [],
        };
    }));
}

type DiscoveredProjectMedia = ProjectMedia & {
    index: number;
};

type DiscoveredNoteMedia = {
    alt: string;
    index: number;
    src: string;
    type: ProjectMedia["type"] | "other";
};

function extractProjectMedia(
    content: string,
    noteDirectory: string,
): ProjectMedia[] {
    const media: DiscoveredNoteMedia[] = [];
    const markdownImagePattern = /!\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/g;
    const obsidianImagePattern = /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

    for (const match of content.matchAll(markdownImagePattern)) {
        const source = match[2] ?? match[3];

        if (source) {
            media.push({
                alt: match[1] || mediaAlt(source),
                index: match.index,
                src: resolveMediaSource(source, noteDirectory),
                type: projectMediaType(source),
            });
        }
    }

    for (const match of content.matchAll(obsidianImagePattern)) {
        const source = match[1];

        if (source) {
            media.push({
                alt: match[2] || mediaAlt(source),
                index: match.index,
                src: resolveMediaSource(source, noteDirectory),
                type: projectMediaType(source),
            });
        }
    }

    const sortedMedia = media.sort((a, b) => a.index - b.index);
    const images = sortedMedia.filter(
        (item): item is DiscoveredProjectMedia => item.type === "image",
    );

    if (images.length > 0) {
        return images.slice(0, 1).map(stripIndex);
    }

    if (sortedMedia.length === 1 && isProjectMedia(sortedMedia[0])) {
        return [stripIndex(sortedMedia[0])];
    }

    return [];
}

function stripIndex({ alt, src, type }: DiscoveredProjectMedia): ProjectMedia {
    return { alt, src, type };
}

function isProjectMedia(
    media: DiscoveredNoteMedia,
): media is DiscoveredProjectMedia {
    return media.type === "image" || media.type === "video";
}

function resolveMediaSource(source: string, noteDirectory: string): string {
    const assetSource = resolveAssetSource(source);

    if (assetSource !== source)
        return assetSource;

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

function mediaAlt(source: string): string {
    return path.posix.basename(source).replace(/\.[^.]+$/, "");
}

function projectMediaType(source: string): DiscoveredNoteMedia["type"] {
    const extension = source
        .split(/[?#]/, 1)[0]
        .match(/\.([a-z0-9]+)$/i)?.[1]
        ?.toLowerCase();

    if (!extension)
        return "image";

    if (["gif", "jpeg", "jpg", "png", "svg", "webp"].includes(extension))
        return "image";

    if (["mov", "mp4", "ogg", "ogv", "webm"].includes(extension))
        return "video";

    return "other";
}

function getExternalUrl(value: string | undefined): string | undefined {
    if (!value)
        return undefined;

    try {
        const url = new URL(value);

        if (url.protocol === "https:" || url.protocol === "http:")
            return url.toString();
    } catch {
        return undefined;
    }

    return undefined;
}

function getDemoAnchor(content: string): string | undefined {
    const match = /^##\s+(Demo|Demonstration)\s*$/im.exec(content);

    return match ? `#${slugifyHeading(match[1])}` : undefined;
}

function slugifyHeading(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
