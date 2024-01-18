'use client'
import { useState } from 'react';
import ScrollTrigger from 'react-scroll-trigger';
import { Project } from "@/lib/definitions";
import { montserrat_700 } from "@/lib/fonts";
import ProjectCard from "@/components/ProjectCard";

interface ProjectSectionProps {
    projectPage: {
        header: string;
        description: string;
        personal_projects: Project[]
    }
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ projectPage }) => {
    const projectSectionHeader = projectPage.header;
    const projectSectionDescription = projectPage.description;
    const personalProjects = projectPage.personal_projects;
    const [isVisible, setIsVisible] = useState(false);

    const handleEnterViewport = () => setIsVisible(true);
    const handleExitViewport = () => setIsVisible(false);

    return (
        <div className={`project-section-container flex flex-col ml-5 md:ml-20 space-y-5 
            transition-all duration-500 ease-in-out transform ${isVisible ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible'}`}>
            <ProjectHeader header={projectSectionHeader} description={projectSectionDescription} />
            {/* @ts-ignore */}
            <ScrollTrigger onEnter={handleEnterViewport} onExit={handleExitViewport}>
                <ProjectCards projects={personalProjects} />
            </ScrollTrigger>
        </div>
    );
}

const ProjectHeader: React.FC<{ header: string, description: string }> = ({ header, description }) => (
    <div className="project-header-container flex flex-col items-center max-w-md space-y-3">
        <p className={`project-header text-4xl font-bold ${montserrat_700.className}`}>{header}</p>
        <p className="project-description text-base text-gray-400">{description}</p>
    </div>
);

const ProjectCards: React.FC<{ projects: Project[] }> = ({ projects }) => (
    <div className="project-cards-container flex flex-wrap gap-y-5 gap-x-28">
        {projects.map((project: Project, index: number) => (
            <ProjectCard key={`${project.project_name}-${index}`}
                name={project.project_name}
                description={project.project_description}
                sourceLink={project.project_website_link}
                logo={project.project_logo}
                sourceRepoLink={project.project_github_link} />
        ))}
    </div>
);

export default ProjectSection;

