const DEFAULT_ASSET_BASE_URL =
    "https://qasimkamran-website-assets.s3.amazonaws.com";

export const assetBaseUrl = (
    process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? DEFAULT_ASSET_BASE_URL
).replace(/\/+$/, "");

export function assetUrl(assetPath: string): string {
    const normalizedPath = assetPath
        .replace(/^\/+/, "")
        .replace(/^assets\/?/, "");

    return `${assetBaseUrl}/${encodePathSegments(normalizedPath)}`;
}

export function resolveAssetSource(source: string): string {
    if (isLocalAssetPath(source))
        return assetUrl(source);

    return source;
}

function isLocalAssetPath(source: string): boolean {
    return source === "/assets" ||
        source.startsWith("/assets/") ||
        source === "assets" ||
        source.startsWith("assets/");
}

function encodePathSegments(value: string): string {
    return value
        .split("/")
        .filter(Boolean)
        .map(encodeURIComponent)
        .join("/");
}
