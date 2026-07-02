import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { parseCssClassProperty } from "@/lib/cssClasses";

const MONTH_YEAR_PATTERN = /^(0[1-9]|1[0-2])\/(\d{4})$/;

export type ExperienceRole = {
    title: string;
    dateRange?: string;
};

export type WorkExperience = {
    employer: string;
    titleColor?: string;
    roles: ExperienceRole[];
    content: string;
};

export function getWorkExperiencePath(): string {
    return path.resolve(process.cwd(), "../Work-Experience");
}

export function getWorkExperienceIconsPath(): string {
    return path.join(getWorkExperiencePath(), "Icons");
}

function formatMonthYear(value: string): string | undefined {
    const match = MONTH_YEAR_PATTERN.exec(value.trim());

    if (!match) {
        return undefined;
    }

    const monthIndex = Number(match[1]) - 1;
    const year = Number(match[2]);

    return new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(Date.UTC(year, monthIndex, 1)));
}

function parseDates(value: unknown): string[] {
    if (typeof value !== "string") {
        return [];
    }

    return value
        .split(",")
        .map((date) => formatMonthYear(date))
        .filter((date): date is string => date !== undefined);
}

function toRoles(properties: Record<string, unknown>): ExperienceRole[] {
    const entries = Object.entries(properties)
        .filter(([, value]) => parseDates(value).length > 0);

    return entries.map(([title, value], index) => {
        const dates = parseDates(value);
        let dateRange: string | undefined;

        if (dates.length > 1) {
            dateRange = `${dates[0]} – ${dates[1]}`;
        } else if (dates.length === 1) {
            const previousDates = index > 0
                ? parseDates(entries[index - 1][1])
                : [];
            const endDate = previousDates[0] ?? "Present";

            dateRange = `${dates[0]} – ${endDate}`;
        }

        return { title, dateRange };
    });
}

export async function getWorkExperiences(): Promise<WorkExperience[]> {
    const directoryPath = getWorkExperiencePath();
    const directoryEntries = await fs.readdir(directoryPath, {
        withFileTypes: true,
    });
    const markdownFiles = directoryEntries
        .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
        .sort((left, right) => left.name.localeCompare(right.name));

    return Promise.all(markdownFiles.map(async (entry) => {
        const source = await fs.readFile(path.join(directoryPath, entry.name), "utf8");
        const note = matter(source);

        return {
            employer: entry.name.replace(/\.md$/i, ""),
            titleColor: parseCssClassProperty(
                note.data.cssclasses,
                "title",
            ),
            roles: toRoles(note.data),
            content: note.content,
        };
    }));
}
