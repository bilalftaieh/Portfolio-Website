'use client'
import ProjectCard from "@/components/ProjectCard";
import { useState } from 'react';
import ScrollTrigger from 'react-scroll-trigger';
import { Project } from "@/lib/definitions";
import { montserrat_700 } from "@/lib/fonts";

interface ProjectSectionProps {
    projectPage: {
        header: string;
        description: string;
        personal_projects: Project[]
    }
}

export default function ProjectSection({ projectPage }: ProjectSectionProps) {

    const projectSectionHeader = projectPage.header
    const projectSectionDescription = projectPage.description
    const personalProjects = projectPage.personal_projects
    const [isVisible, setIsVisible] = useState(false);

    const onEnterViewport = () => {
        setIsVisible(true);
    }

    const onExitViewport = () => {
        setIsVisible(false);
    }

    return (
        <div className={`flex flex-col ml-20 space-y-5 
            transition-all duration-500 ease-in-out transform ${isVisible ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible'}`}>
            <div className="flex flex-col items-center max-w-md space-y-3">
                <p className={`header text-4xl font-bold ${montserrat_700.className}`}>{projectSectionHeader}</p>
                <p className="description text-base text-gray-400">{projectSectionDescription}</p>
            </div>
            {/* @ts-ignore */}
            <ScrollTrigger onEnter={onEnterViewport} onExit={onExitViewport}>
                <div className="flex flex-wrap gap-y-5 gap-x-28">
                    {personalProjects.map((project: Project, index: number) => {
                        return <ProjectCard key={`${project.project_name}-${index}`}
                            name={project.project_name}
                            description={project.project_description}
                            sourceLink={project.project_website_link}
                            logo={project.project_logo}
                            sourceRepoLink={project.project_github_link} />
                    })}
                </div>
            </ScrollTrigger>
        </div>

    );
}