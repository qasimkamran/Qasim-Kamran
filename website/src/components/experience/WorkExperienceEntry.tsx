import MarkdownContent from "@/components/MarkdownContent";
import type {
    ExperienceRole,
    WorkExperience,
} from "@/lib/workExperience";

export default function WorkExperienceEntry({
    experience,
}: {
    experience: WorkExperience;
}) {
    return (
        <article>
            <h2
                className="mb-5 font-sans text-3xl font-normal uppercase"
                style={{ color: experience.titleColor }}
            >
                {experience.employer}
            </h2>

            <div className="mb-7 space-y-4">
                {experience.roles.map((role, index) => (
                    <RoleHeading
                        key={`${role.title}-${index}`}
                        role={role}
                        primary={index === 0}
                    />
                ))}
            </div>

            <MarkdownContent
                content={experience.content}
                tableImageBasePath="/exp/icons"
            />
        </article>
    );
}

function RoleHeading({
    role,
    primary,
}: {
    role: ExperienceRole;
    primary: boolean;
}) {
    const Heading = primary ? "h3" : "h4";

    return (
        <Heading
            className={primary
                ? "flex flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-bold"
                : "flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xl font-semibold"}
        >
            <span>{role.title}</span>
            {role.dateRange && (
                <span className="text-sm font-normal text-neutral-400">
                    {role.dateRange}
                </span>
            )}
        </Heading>
    );
}
