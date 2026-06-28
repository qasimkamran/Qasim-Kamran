import { isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { containsArabic } from "@/lib/arabic";

export default function MarkdownContent({ content }: { content: string }) {
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
                    th: MarkdownTableHeader,
                    td: MarkdownTableCell,
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
            className={`mb-6 mt-10 font-bold first:mt-0 ${directionalClassName(children, "text-right text-[2.3625rem]", "text-4xl")}`}
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
            className={`mb-4 mt-8 font-semibold first:mt-0 ${directionalClassName(children, "text-right text-[1.96875rem]", "text-3xl")}`}
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
            className={`mb-3 mt-6 font-semibold first:mt-0 ${directionalClassName(children, "text-right text-[1.575rem]", "text-2xl")}`}
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
            className={`mb-2 mt-5 font-semibold first:mt-0 ${directionalClassName(children, "text-right text-[1.3125rem]", "text-xl")}`}
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

function MarkdownTableHeader({ children }: { children?: ReactNode }) {
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

function MarkdownTableCell({ children }: { children?: ReactNode }) {
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
