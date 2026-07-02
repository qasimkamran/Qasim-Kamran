import type { WorkExperience } from "@/lib/workExperience";

import WorkExperienceEntry from "./WorkExperienceEntry";

export default function WorkExperiencePage({
    experiences,
}: {
    experiences: WorkExperience[];
}) {
    return (
        <main className="w-full max-w-4xl px-6 py-12">
            <h1 className="mb-12 text-4xl font-bold">Work Experience</h1>

            <div className="space-y-14">
                {experiences.map((experience) => (
                    <WorkExperienceEntry
                        key={experience.employer}
                        experience={experience}
                    />
                ))}
            </div>
        </main>
    );
}
