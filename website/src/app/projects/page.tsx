import ProjectCard from "@/components/projects/ProjectCard";
import { getProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <main className="w-full max-w-5xl px-6 py-12">
            <h1 className="mb-12 text-4xl font-bold">Projects</h1>

            <div className="grid gap-8">
                {projects.map((project) => (
                    <ProjectCard key={project.title} project={project} />
                ))}
            </div>
        </main>
    );
}
