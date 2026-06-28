import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

import matter from "gray-matter";

function getVaultPath(): string {
    const configuredPath = process.env.BLOG_CONTENT_PATH;

    if (!configuredPath)
        throw new Error("BLOG_CONTENT_PATH is not set");

    return path.resolve(process.cwd(), configuredPath);
}

const execFileAsync = promisify(execFile);

async function getTrackedFiles() : Promise<string[]> {
    const vaultPath = getVaultPath();

    const { stdout } = await execFileAsync(
        "git",
        ["ls-files", "-z"],
        {
            cwd: vaultPath,
            maxBuffer: 10 * 1024 * 1024,
        },
    );
    return stdout
            .split("\0")
            .filter(Boolean)
            .map((relativePath) => relativePath.replaceAll("\\", "/"));
}

async function getTrackedMarkdownFiles(): Promise<string[]> {
    const files = await getTrackedFiles();
    return files.filter((file) =>
        file.toLowerCase().endsWith(".md"),
    );
}

async function getTrackedMarkdownFileLastModified(
    mdFileRelativePath: string,
): Promise<string> {
    const vaultPath = getVaultPath();

    if (!mdFileRelativePath?.trim()) {
        throw new Error("Markdown file path cannot be empty.");
    }

    const normalizedPath = mdFileRelativePath
        .trim()
        .replaceAll("\\", "/");

    if (path.posix.isAbsolute(normalizedPath)) {
        throw new Error("Markdown file path must be relative to the vault.");
    }

    if (
        normalizedPath === ".." ||
        normalizedPath.startsWith("../") ||
        normalizedPath.includes("/../")
    ) {
        throw new Error("Markdown file path cannot leave the vault.");
    }

    if (path.posix.extname(normalizedPath).toLowerCase() !== ".md") {
        throw new Error(`File is not a Markdown file: ${normalizedPath}`);
    }

    const { stdout: trackedOutput } = await execFileAsync(
        "git",
        ["ls-files", "--error-unmatch", "--", normalizedPath],
        {
            cwd: vaultPath,
            maxBuffer: 1024 * 1024,
        },
    ).catch(() => {
        throw new Error(
            `Markdown file is not tracked by Git: ${normalizedPath}`,
        );
    });

    if (!trackedOutput.trim()) {
        throw new Error(
            `Markdown file is not tracked by Git: ${normalizedPath}`,
        );
    }

    const { stdout: dateOutput } = await execFileAsync(
        "git",
        [
            "log",
            "--follow",
            "-1",
            "--format=%cI",
            "--",
            normalizedPath,
        ],
        {
            cwd: vaultPath,
            maxBuffer: 1024 * 1024,
        },
    ).catch((error: unknown) => {
        const message =
            error instanceof Error ? error.message : String(error);

        throw new Error(
            `Failed to read Git history for "${normalizedPath}": ${message}`,
        );
    });

    const lastModified = dateOutput.trim();

    if (!lastModified) {
        throw new Error(
            `No Git commit history found for: ${normalizedPath}`,
        );
    }

    const parsedDate = new Date(lastModified);

    if (Number.isNaN(parsedDate.getTime())) {
        throw new Error(
            `Git returned an invalid date for "${normalizedPath}": ${lastModified}`,
        );
    }

    return lastModified;
}

type ContentTreeNode = {
    folders: Map<string, ContentTreeNode>;
    notes: string[];
};

async function buildTrackedContentTree(): Promise<ContentTreeNode> {
    const markdownFiles = await getTrackedMarkdownFiles();

    const root: ContentTreeNode = {
        folders: new Map(),
        notes: [],
    };

    for (const relativePath of markdownFiles) {
        const parts = relativePath.split("/");
        const filename = parts.pop();

        if (!filename)
            continue;

        let current = root;

        for (const folderName of parts) {
            let folder = current.folders.get(folderName);

            if (!folder) {
                folder = {
                    folders: new Map(),
                    notes: [],
                };
                current.folders.set(folderName, folder);
            }

            current = folder;
        }

        current.notes.push(filename);
    }

    return root;
}

export type BlogDirectory = {
    type: "directory";
    name: string;
    slug: string[];
};

export type BlogNote = {
    type: "note";
    name: string;
    slug: string[];
    title: string;
    description?: string;
    date?: string;
    tags: string[];
};

export type DirectoryContents = {
    directories: BlogDirectory[];
    notes: BlogNote[];
};

export type ParsedNote = BlogNote & {
    content: string;
    background?: string;
    foreground?: string;
};

export function toSlugSegment(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function removeMarkdownExtension(filename: string): string {
  return filename.replace(/\.md$/i, "");
}

type ResolvedDirectory = {
    node: ContentTreeNode;
    realSegments: string[];
};

function resolveDirectoryFromTree(
    root: ContentTreeNode,
    slug: string[],
) : ResolvedDirectory | null {
    let currentNode = root;
    const realSegments: string[] = [];

    for (const requestedSegment of slug) {
        const match = Array.from(currentNode.folders.entries()).find(
            ([folderName]) =>
            toSlugSegment(folderName) === requestedSegment,
        );

        if (!match)
            return null;

        const [folderName, folderNode] = match;

        realSegments.push(folderName);
        currentNode = folderNode;
    }

    return {
        node: currentNode,
        realSegments,
    };
}

type ResolvedNote = {
    relativePath: string;
    filename: string;
};

function resolveNoteFromTree(
    root: ContentTreeNode,
    slug: string[],
) : ResolvedNote | null {
    if (slug.length === 0)
        return null;

    const directorySlug = slug.slice(0, -1);
    const requestedNoteSegment = slug.at(-1);

    if (!requestedNoteSegment)
        return null;

    const resolvedDirectory = resolveDirectoryFromTree(
        root,
        directorySlug
    );

    if (!resolvedDirectory)
        return null;

    const filename = resolvedDirectory.node.notes.find(
        (noteFilename) =>
            toSlugSegment(removeMarkdownExtension(noteFilename)) ===
            requestedNoteSegment
    );

    if (!filename)
        return null;

    return {
        filename,
        relativePath: path.join(
            ...resolvedDirectory.realSegments,
            filename,
        ),
    };
}

function parseOptionalString(value: unknown): string | undefined {
    return typeof value === "string" ? value : undefined;
}

function parseTags(value: unknown): string[] {
    if (!Array.isArray(value))
        return [];

    return value.map(String);
}

function parseCssClassProperty(
    value: unknown,
    propertyName: "background" | "foreground",
): string | undefined {
    if (!Array.isArray(value))
        return undefined;

    const prefix = `${propertyName}:`;

    const match = value
        .map(String)
        .find((entry) => entry.trim().toLowerCase().startsWith(prefix));

    if (!match)
        return undefined;

    const propertyValue = match.slice(match.indexOf(":") + 1).trim();

    return propertyValue.length > 0 ? propertyValue : undefined;
}

async function parseNoteMetadata(
    relativePath: string,
    slug: string[],
): Promise<BlogNote | null> {
    const absolutePath = path.join(getVaultPath(), relativePath);
    
    const source = await fs.readFile(absolutePath, "utf8");
    
    const parsed = matter(source);
    
    const filename = path.basename(relativePath);
    
    const fallbackName = removeMarkdownExtension(filename);
    
    if (parsed.data.published === false)
        return null;

    return {
        type: "note",
        name: fallbackName,
        slug,
        title: fallbackName,
        description: parseOptionalString(parsed.data.description),
        date: await getTrackedMarkdownFileLastModified(relativePath),
        tags: parseTags(parsed.data.tags),
    };
}

export async function getDirectoryContents(
    slug: string[],
): Promise<DirectoryContents | null> {
    const tree = await buildTrackedContentTree();
    
    const resolvedDirectory = resolveDirectoryFromTree(tree, slug);
    
    if (!resolvedDirectory)
        return null;
    
    const directories: BlogDirectory[] =
        Array.from( resolvedDirectory.node.folders.keys(), )
            .map((folderName) => ({
                type: "directory" as const,
                name: folderName,
                slug: [...slug, toSlugSegment(folderName)],
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
        
        const notes: BlogNote[] = [];

        for (const filename of resolvedDirectory.node.notes) {
            const noteName = removeMarkdownExtension(filename);
    
            const noteSlug = [...slug, toSlugSegment(noteName)];
            
            const relativePath = path.join( ...resolvedDirectory.realSegments, filename, );
           
            const note = await parseNoteMetadata(relativePath, noteSlug);
            
            if (note)
                notes.push(note);
        }

        notes.sort((a, b) => a.title.localeCompare(b.title));

        return {
            directories,
            notes,
        };
}

export async function getNote( slug: string[], ): Promise<ParsedNote | null> {
    const tree = await buildTrackedContentTree();
    const resolvedNote = resolveNoteFromTree(tree, slug);
    
    if (!resolvedNote)
        return null;
    
    const absolutePath = path.join( getVaultPath(), resolvedNote.relativePath, );
    
    const source = await fs.readFile(absolutePath, "utf8");
    
    const parsed = matter(source);
    
    const fallbackName = removeMarkdownExtension( resolvedNote.filename, );
    
    if (parsed.data.published === false)
        return null;
    
    return {
        type: "note",
        name: fallbackName,
        slug,
        title: fallbackName,
        description: parseOptionalString(parsed.data.description),
        date: await getTrackedMarkdownFileLastModified(
            resolvedNote.relativePath,
        ),
        tags: parseTags(parsed.data.tags),
        background: parseCssClassProperty(parsed.data.cssclasses, "background"),
        foreground: parseCssClassProperty(parsed.data.cssclasses, "foreground"),
        content: parsed.content, };
}

export async function getAllBlogSlugs(): Promise<string[][]> {
    const tree = await buildTrackedContentTree();
    const slugs: string[][] = [[]];

    async function walk( node: ContentTreeNode, currentSlug: string[], realSegments: string[], ): Promise<void> {
        for (const [folderName, folderNode] of node.folders) {
            const folderSlug = [ ...currentSlug, toSlugSegment(folderName), ];
    
            slugs.push(folderSlug);
            
            await walk( folderNode, folderSlug, [...realSegments, folderName], );
        }
        for (const filename of node.notes) {
            const noteName = removeMarkdownExtension(filename);

            const noteSlug = [ ...currentSlug, toSlugSegment(noteName), ];
            
            const relativePath = path.join( ...realSegments, filename, );
            
            const note = await parseNoteMetadata( relativePath, noteSlug, );
            
            if (note)
                slugs.push(noteSlug);
        }
    }

    await walk(tree, [], []);

    return slugs;
}
