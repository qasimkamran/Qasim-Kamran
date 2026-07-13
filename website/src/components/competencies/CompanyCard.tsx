import Image from "next/image";
import Link from "next/link";

import type { Role, WorkCompetency } from "@/lib/workCompetencies";

export default function CompanyCard({
    competency,
}: {
    competency: WorkCompetency;
}) {
    return (
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/10 sm:p-8">
            <header className="mb-8">
                <h2 className="text-3xl font-semibold text-white">
                    {competency.company}
                </h2>
            </header>

            <div className="grid gap-y-8 sm:grid-cols-[0_minmax(0,20rem)_1.5rem_minmax(12rem,1fr)]">
                <section className="sm:col-start-2 sm:row-span-2 sm:row-start-1">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-purple-200">
                        Roles
                    </h3>
                    <div className="space-y-4">
                        {competency.roles.map((role) => (
                            <RoleDetails
                                key={`${role.title}-${role.startDate}`}
                                role={role}
                            />
                        ))}
                    </div>
                </section>

                <section className="sm:col-start-4 sm:row-start-1">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-purple-200">
                        Stack
                    </h3>
                    <ul className="flex flex-wrap gap-3">
                        {competency.stack.map((technology) => (
                            <li
                                key={technology}
                                className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 p-2"
                                title={technology}
                            >
                                <Image
                                    src={`/assets/icons/${encodeURIComponent(technology)}.png`}
                                    alt={`${technology} icon`}
                                    width={40}
                                    height={40}
                                    className="h-8 w-8 object-contain"
                                />
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="sm:col-start-4 sm:row-start-2">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-purple-200">
                        Domain
                    </h3>
                    <p className="text-base text-purple-100">
                        {competency.domain}
                    </p>
                </section>
            </div>

            {competency.notes.length > 0 && (
                <section className="mt-8 border-t border-white/10 pt-8">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-purple-200">
                        Competencies
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {competency.notes.map((note) => (
                            <Link
                                key={note.slug.join("/")}
                                href={`/blog/${note.slug.join("/")}`}
                                className="rounded-lg bg-[#2a123f] p-4 font-semibold text-white transition-colors hover:bg-[#3a1a57]"
                            >
                                {note.title}
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </article>
    );
}

function RoleDetails({ role }: { role: Role }) {
    return (
        <div>
            <h4 className="text-lg font-semibold text-white">{role.title}</h4>
            <p className="mt-1 text-sm text-neutral-400">
                <time>{role.startDate}</time>
                {" – "}
                <time>{role.endDate}</time>
            </p>
        </div>
    );
}
