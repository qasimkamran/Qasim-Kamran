import WorkExperiencePage from "@/components/experience/WorkExperiencePage";
import { getWorkExperiences } from "@/lib/workExperience";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
    const experiences = await getWorkExperiences();

    return <WorkExperiencePage experiences={experiences} />;
}
