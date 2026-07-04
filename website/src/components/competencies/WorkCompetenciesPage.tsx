import type { WorkCompetency } from "@/lib/workCompetencies";

import CompanyCard from "./CompanyCard";

export default function WorkCompetenciesPage({
    competencies,
}: {
    competencies: WorkCompetency[];
}) {
    return (
        <main className="w-full max-w-4xl px-6 py-12">
            <h1 className="mb-12 text-4xl font-bold">Work Competencies</h1>

            <div className="space-y-12">
                {competencies.map((competency) => (
                    <CompanyCard
                        key={competency.company}
                        competency={competency}
                    />
                ))}
            </div>
        </main>
    );
}
