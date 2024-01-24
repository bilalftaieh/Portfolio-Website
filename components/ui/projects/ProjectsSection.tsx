'use client'
import { SocialIconComponent } from "@/components/SocialIcon";
import { Project } from "@/lib/definitions";
import { montserrat_700 } from "@/lib/fonts";
import DOMPurify from "isomorphic-dompurify";
import { useState, useEffect } from "react";
import ScrollTrigger from "react-scroll-trigger";
import Image from 'next/image';
import { Image as NextUIImage } from '@nextui-org/react';

interface ProjectsSectionProps {
    projectsData: {
        projectSectionHeader: string;
        projectSectionDescription: string;
        projects: Project[]
    }
}
export default function ProjectsSection({ projectsData }: ProjectsSectionProps) {
    const [isVisible, setIsVisible] = useState(false);

    const onEnterViewport = () => setIsVisible(true);
    const onExitViewport = () => setIsVisible(false);

    return (
        //@ts-ignore
        <ScrollTrigger onEnter={onEnterViewport} onExit={onExitViewport}>
            <div id="info-section" className={`project-section-container gap-5 p-10 
            flex flex-col md:transition-all transition-opacity duration-500 ease-in-out 
        ${isVisible ? 'md:translate-y-0 opacity-100 visible' : 'md:-translate-y-96 opacity-0 invisible'}`}>
                <ProjectInfoSection
                    infoHeader={projectsData.projectSectionHeader}
                    infoDescription={projectsData.projectSectionDescription}
                />
                <ProjectsContainer projects={projectsData.projects} />
            </div>

        </ScrollTrigger>
    )
}

const ProjectInfoSection: React.FC<{ infoHeader: string, infoDescription: string }> = ({ infoHeader, infoDescription }) => (
    <div id="info" className="project-info-container flex flex-col gap-3 max-w-md">
        <p className={`project-info-header text-3xl md:text-4xl font-bold ${montserrat_700.className}`}>{infoHeader}</p>
        <p className="info-description text-base">{infoDescription} </p>
    </div>
);


const ProjectsContainer: React.FC<{ projects: Project[] }> = ({ projects }) => {
    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
    
    const visitButton = (buttonLink: string, buttonText: string) => {
        const link = buttonLink.startsWith('https://') ? buttonLink : `https://${buttonLink}`;
        return buttonLink.length > 0 ? 
            <a href={link} className="text-white hover:bg-custom-one-light font-bold py-2 px-4 rounded">
                {buttonText}
            </a> : 
            <p className="text-gray-400 cursor-default font-bold py-2 px-4 rounded">
                {buttonText}
            </p>;
    }
    

    useEffect(() => {
        // Initialize visibility state for each project
        const initialVisibility = projects.reduce((acc: Record<string, boolean>, project, index) => {
            acc[project.meta.id] = index === 0 ? true : false;  // Change this line
            return acc;
        }, {});
        setIsVisible(initialVisibility);
    }, [projects]);



    const onEnterViewport = (projectId: number) => {
        setIsVisible(prevState => ({ ...prevState, [projectId]: true }));
    }

    const onExitViewport = (projectId: number) => {
        setIsVisible(prevState => ({ ...prevState, [projectId]: false }));
    }

    const sanitizeElement = (element: string) => {
        return DOMPurify.sanitize(element);
    }

    return (
        <div className="flex flex-col">
            {projects.map((project) => {
                return (
                    //@ts-ignore
                    <ScrollTrigger key={project.meta.id} onEnter={() => onEnterViewport(project.meta.id)} onExit={() => onExitViewport(project.meta.id)}>
                        <div id={String(project.meta.id)} className={`min-h-screen my-12 transition-opacity duration-1000 
                        flex flex-col gap-6 ${isVisible[String(project.meta.id)] ? 'opacity-100' : 'opacity-0'}`}>

                            <div className="flex flex-col md:flex-row justify-around 
                            gap-5 md:gap-0 items-center md:items-start">

                                <div className="flex gap-5 items-center">
                                    <NextUIImage
                                        as={Image}
                                        alt="nextui logo"
                                        height={40}
                                        radius="sm"
                                        src={project.project_logo}
                                        width={40}
                                    />
                                    <p className={`info-header text-center text-2xl md:text-3xl font-bold ${montserrat_700.className}`}>{project.project_name}</p>
                                </div>

                                <div className="flex gap-5 items-center">
                                    {visitButton(project.project_github_link,'Visit Repo')}
                                    {visitButton(project.project_website_link,'Visit Website')}
                                </div>

                            </div>

                            <div className="flex flex-col px-4 text-center md:text-start md:px-28 gap-5">
                                {project.project_screenshot.length > 0 ? <NextUIImage
                                    src={project.project_screenshot}
                                    width={1000}
                                    height={1000}
                                    shadow="sm"
                                /> : ''}

                                {project.project_overview.length > 0 ? <div className="flex flex-col gap-5">
                                    <p className="font-bold text-3xl ">
                                        Overview
                                    </p>
                                    <div className="text-gray-400"
                                        dangerouslySetInnerHTML={{ __html: sanitizeElement(project.project_description) }} />

                                </div> : ''}
                                

                                {project.technologies_used.length > 0 ? <div className="flex flex-col gap-5">
                                    <p className="font-bold text-3xl ">
                                        Technologies Used
                                    </p>

                                    <div className="flex flex-col gap-5">
                                        {project.technologies_used.map((item, index) => {
                                            return (
                                                <SocialIconComponent
                                                    key={`${item.social_name}-${index}`}
                                                    social_name={item.social_name}
                                                    social_link={item.social_link}
                                                    icon_url={item.icon_url}
                                                    social_fa_icon_color={item.social_fa_icon_color}
                                                    social_fa_icon_name={item.social_fa_icon_name}
                                                    social_fa_icon_type={item.social_fa_icon_type}
                                                    icon_height={item.icon_height}
                                                    icon_width={item.icon_width}
                                                />
                                            );
                                        })}
                                    </div>

                                </div> : ''}


                            </div>

                        </div>
                    </ScrollTrigger>
                )
            })}
        </div>
    );
}
