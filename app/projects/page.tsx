import ProjectsSection from "@/components/ui/projects/ProjectsSection";
import { fetchPages, fetchProjects } from "@/lib/butterCmsApi";

export default async function ProjectsPage() {
    const [pages, projects] = await Promise.all([fetchPages(), fetchProjects()]);
    const projectsPageFields = pages[1].fields

    const projectSectionData = {
        projectSectionHeader: projectsPageFields.header,
        projectSectionDescription: projectsPageFields.description,
        projects: projects
    }

    return (
        <ProjectsSection projectsData={projectSectionData} />
    )
}