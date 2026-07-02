import fs from "node:fs/promises";
import path from "node:path";

import { getWorkExperienceIconsPath } from "@/lib/workExperience";

const IMAGE_FILENAME_PATTERN = /^[^/\\]+\.(?:png|jpe?g|gif|webp|svg)$/i;

const CONTENT_TYPES: Record<string, string> = {
    ".gif": "image/gif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
};

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ filename: string }> },
) {
    const { filename } = await params;

    if (!IMAGE_FILENAME_PATTERN.test(filename)) {
        return new Response("Not found", { status: 404 });
    }

    const extension = path.extname(filename).toLowerCase();

    try {
        const image = await fs.readFile(
            path.join(getWorkExperienceIconsPath(), filename),
        );

        return new Response(image, {
            headers: {
                "Cache-Control": "public, max-age=3600",
                "Content-Type": CONTENT_TYPES[extension],
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch {
        return new Response("Not found", { status: 404 });
    }
}
