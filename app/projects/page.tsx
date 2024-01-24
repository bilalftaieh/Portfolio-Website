import ProjectsSection from "@/components/ui/projects/ProjectsSection";
import { fetchPages, fetchProjects } from "@/lib/butterCmsApi";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Belal Alfutayh | Projects',
    description: 'Projects created by Belal Alfutayh',
  }

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