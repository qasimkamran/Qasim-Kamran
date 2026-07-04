import WorkCompetenciesPage from "@/components/competencies/WorkCompetenciesPage";
import { getWorkCompetencies } from "@/lib/workCompetencies";

export const dynamic = "force-dynamic";

export default async function CompetenciesPage() {
    const competencies = await getWorkCompetencies();

    return <WorkCompetenciesPage competencies={competencies} />;
}
