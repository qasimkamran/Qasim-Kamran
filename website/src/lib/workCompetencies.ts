import competenciesData from "@/data/workCompetenciesData.json";
import { getDirectoryContents, toSlugSegment, type BlogNote } from "@/lib/blog";

export type Role = {
    title: string;
    startDate: string;
    endDate: string;
};

export type Company = {
    company: string;
    roles: Role[];
    domain: string;
    stack: string[];
};

export type WorkCompetency = Company & {
    notes: BlogNote[];
};

const companies: Company[] = competenciesData;

export async function getWorkCompetencies(): Promise<WorkCompetency[]> {
    return Promise.all(companies.map(async (company) => {
        const companySlug = toSlugSegment(company.company);
        const directory = await getDirectoryContents([
            "work-competencies",
            companySlug,
        ]);

        return {
            ...company,
            notes: directory?.notes ?? [],
        };
    }));
}
