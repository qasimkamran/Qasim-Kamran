/* eslint-disable @next/next/no-img-element */
import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { containsArabic } from "@/lib/arabic";

export default function MarkdownContent({
    content,
    tableImageBasePath,
}: {
    content: string;
    tableImageBasePath?: string;
}) {
    return (
        <div className="prose prose-neutral max-w-none text-current dark:prose-invert">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: MarkdownHeading1,
                    h2: MarkdownHeading2,
                    h3: MarkdownHeading3,
                    h4: MarkdownHeading4,
                    p: MarkdownParagraph,
                    li: MarkdownListItem,
                    blockquote: MarkdownBlockquote,
                    img: MarkdownMedia,
                    table: ({ children }) => (
                        <table className={tableImageBasePath
                            ? "!my-3 !w-auto !border-separate !border-spacing-0 !border-0"
                            : undefined}
                        >
                            {children}
                        </table>
                    ),
                    tr: ({ children }) => (
                        <tr className={tableImageBasePath ? "!border-0" : undefined}>
                            {children}
                        </tr>
                    ),
                    th: ({ children }) => (
                        <MarkdownTableHeader imageBasePath={tableImageBasePath}>
                            {children}
                        </MarkdownTableHeader>
                    ),
                    td: ({ children }) => (
                        <MarkdownTableCell imageBasePath={tableImageBasePath}>
                            {children}
                        </MarkdownTableCell>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

function MarkdownHeading1({ children }: { children?: ReactNode }) {
    return (
        <h1
            id={headingId(children)}
            className={`mb-6 mt-10 scroll-mt-8 font-bold first:mt-0 ${directionalClassName(children, "text-right text-[2.3625rem]", "text-4xl")}`}
            dir={textDirection(children)}
            lang={textLanguage(children)}
        >
            {children}
        </h1>
    );
}

function MarkdownHeading2({ children }: { children?: ReactNode }) {
    return (
        <h2
            id={headingId(children)}
            className={`mb-4 mt-8 scroll-mt-8 font-semibold first:mt-0 ${directionalClassName(children, "text-right text-[1.96875rem]", "text-3xl")}`}
            dir={textDirection(children)}
            lang={textLanguage(children)}
        >
            {children}
        </h2>
    );
}

function MarkdownHeading3({ children }: { children?: ReactNode }) {
    return (
        <h3
            id={headingId(children)}
            className={`mb-3 mt-6 scroll-mt-8 font-semibold first:mt-0 ${directionalClassName(children, "text-right text-[1.575rem]", "text-2xl")}`}
            dir={textDirection(children)}
            lang={textLanguage(children)}
        >
            {children}
        </h3>
    );
}

function MarkdownHeading4({ children }: { children?: ReactNode }) {
    return (
        <h4
            id={headingId(children)}
            className={`mb-2 mt-5 scroll-mt-8 font-semibold first:mt-0 ${directionalClassName(children, "text-right text-[1.3125rem]", "text-xl")}`}
            dir={textDirection(children)}
            lang={textLanguage(children)}
        >
            {children}
        </h4>
    );
}

function MarkdownParagraph({ children }: { children?: ReactNode }) {
    return (
        <p
            className={`my-4 leading-7 ${directionalClassName(children, "text-right text-[1.05rem]")}`}
            dir={textDirection(children)}
            lang={textLanguage(children)}
        >
            {children}
        </p>
    );
}

function MarkdownListItem({ children }: { children?: ReactNode }) {
    return (
        <li
            className={directionalClassName(children, "text-right text-[1.05rem]")}
            dir={textDirection(children)}
            lang={textLanguage(children)}
        >
            {children}
        </li>
    );
}

function MarkdownBlockquote({ children }: { children?: ReactNode }) {
    const isArabic = containsArabicText(children);

    return (
        <blockquote
            className={`my-6 border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300 ${
                isArabic
                    ? "!border-l-0 !border-r-4 !pl-0 !pr-4 text-right"
                    : "!border-l-4 !border-r-0 !pl-4 !pr-0"
            }`}
            dir={isArabic ? "rtl" : undefined}
            lang={isArabic ? "ar" : undefined}
        >
            {children}
        </blockquote>
    );
}

function MarkdownMedia({
    src,
    alt,
    ...props
}: ComponentPropsWithoutRef<"img">) {
    const mediaSrc = typeof src === "string" ? src : undefined;

    if (mediaSrc && isVideoSource(mediaSrc)) {
        return (
            <video
                controls
                preload="metadata"
                aria-label={alt || undefined}
                className="my-6 w-full rounded-md"
            >
                <source src={mediaSrc} type={videoContentType(mediaSrc)} />
                {alt ? `${alt}: ` : null}
                <a href={mediaSrc}>{mediaSrc}</a>
            </video>
        );
    }

    return <img src={src} alt={alt ?? ""} {...props} />;
}

function MarkdownTableHeader({
    children,
    imageBasePath,
}: {
    children?: ReactNode;
    imageBasePath?: string;
}) {
    const imageFilename = getTableImageFilename(children);

    if (imageFilename && imageBasePath) {
        return (
            <th className="!border-0 !p-4">
                <MarkdownTableImage
                    filename={imageFilename}
                    basePath={imageBasePath}
                />
            </th>
        );
    }

    return (
        <th
            className={directionalClassName(children, "text-right text-[1.05rem]")}
            dir={textDirection(children)}
            lang={textLanguage(children)}
        >
            {children}
        </th>
    );
}

function MarkdownTableCell({
    children,
    imageBasePath,
}: {
    children?: ReactNode;
    imageBasePath?: string;
}) {
    const imageFilename = getTableImageFilename(children);

    if (imageFilename && imageBasePath) {
        return (
            <td className="!border-0 !p-4">
                <MarkdownTableImage
                    filename={imageFilename}
                    basePath={imageBasePath}
                />
            </td>
        );
    }

    return (
        <td
            className={directionalClassName(children, "text-right text-[1.05rem]")}
            dir={textDirection(children)}
            lang={textLanguage(children)}
        >
            {children}
        </td>
    );
}

const videoContentTypes: Record<string, string> = {
    mov: "video/quicktime",
    mp4: "video/mp4",
    ogg: "video/ogg",
    ogv: "video/ogg",
    webm: "video/webm",
};

function isVideoSource(src: string): boolean {
    const extension = getSourceExtension(src);

    return extension ? extension in videoContentTypes : false;
}

function videoContentType(src: string): string | undefined {
    const extension = getSourceExtension(src);

    return extension ? videoContentTypes[extension] : undefined;
}

function getSourceExtension(src: string): string | undefined {
    const sourcePath = getSourcePath(src);
    const match = /\.([a-z0-9]+)$/i.exec(sourcePath);

    return match?.[1].toLowerCase();
}

function getSourcePath(src: string): string {
    try {
        const url = new URL(src, "http://localhost");
        const assetPath = url.searchParams.get("path");

        return assetPath ?? url.pathname;
    } catch {
        return src.split(/[?#]/, 1)[0];
    }
}

function getTableImageFilename(children: ReactNode): string | undefined {
    if (typeof children !== "string") {
        return undefined;
    }

    const filename = children.trim();

    return /^[^/\\]+\.(?:png|jpe?g|gif|webp|svg)$/i.test(filename)
        ? filename
        : undefined;
}

function MarkdownTableImage({
    filename,
    basePath,
}: {
    filename: string;
    basePath: string;
}) {
    return (
        <Image
            src={`${basePath}/${encodeURIComponent(filename)}`}
            alt={filename.replace(/\.[^.]+$/, "")}
            width={48}
            height={48}
            className="m-0 h-12 w-12 object-contain"
        />
    );
}

function containsArabicText(value: ReactNode): boolean {
    if (typeof value === "string") {
        return containsArabic(value);
    }

    if (Array.isArray(value)) {
        return value.some(containsArabicText);
    }

    if (isValidElement<{ children?: ReactNode }>(value)) {
        return containsArabicText(value.props.children);
    }

    return false;
}

function headingId(value: ReactNode): string | undefined {
    const text = nodeText(value);

    if (!text)
        return undefined;

    return text
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function nodeText(value: ReactNode): string {
    if (typeof value === "string" || typeof value === "number") {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value.map(nodeText).join("");
    }

    if (isValidElement<{ children?: ReactNode }>(value)) {
        return nodeText(value.props.children);
    }

    return "";
}

function textDirection(value: ReactNode) {
    return containsArabicText(value) ? "rtl" : undefined;
}

function textLanguage(value: ReactNode) {
    return containsArabicText(value) ? "ar" : undefined;
}

function directionalClassName(
    value: ReactNode,
    arabicClassName: string,
    defaultClassName = "",
) {
    return containsArabicText(value) ? arabicClassName : defaultClassName;
}
