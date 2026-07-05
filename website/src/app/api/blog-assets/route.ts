import fs from "node:fs/promises";
import path from "node:path";

const contentTypes: Record<string, string> = {
    ".gif": "image/gif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
};

export async function GET(request: Request) {
    const relativePath = new URL(request.url).searchParams.get("path");
    const vaultPath = getVaultPath();

    if (!relativePath)
        return new Response("Not found", { status: 404 });

    const absolutePath = path.resolve(vaultPath, relativePath);
    const extension = path.extname(absolutePath).toLowerCase();

    if (
        !absolutePath.startsWith(`${vaultPath}${path.sep}`) ||
        !contentTypes[extension]
    ) {
        return new Response("Not found", { status: 404 });
    }

    try {
        const image = await fs.readFile(absolutePath);

        return new Response(image, {
            headers: {
                "Cache-Control": "public, max-age=3600",
                "Content-Type": contentTypes[extension],
            },
        });
    } catch {
        return new Response("Not found", { status: 404 });
    }
}

function getVaultPath(): string {
    const configuredPath = process.env.BLOG_CONTENT_PATH;

    if (!configuredPath)
        throw new Error("BLOG_CONTENT_PATH is not set");

    return path.resolve(process.cwd(), configuredPath);
}
