'use client'
import { useState } from 'react';
import ScrollTrigger from 'react-scroll-trigger';
import { montserrat_700 } from "@/lib/fonts";
import { SocialIcon } from '@/lib/definitions';
import { SocialIconComponent } from '@/components/SocialIcon';

interface SkillsSectionProps {
    skillsSectionData: {
        skillSectionHeader: string;
        skillSectionDescription: string;
        technologiesHeader: string;
        toolsHeader: string;
        technologySkills: SocialIcon[];
        toolsSkills: SocialIcon[];
    }
}
export default function SkillsSection({ skillsSectionData }: SkillsSectionProps) {
    const [isVisible, setIsVisible] = useState(false);

    const handleEnterViewport = () => setIsVisible(true);
    const handleExitViewport = () => setIsVisible(false);

    return (
        //@ts-ignore
        <ScrollTrigger onEnter={handleEnterViewport} onExit={handleExitViewport}>
            <div className={`journey-section p-5 md:p-0 flex flex-col md:ml-20 space-y-5 mt-5 break-words
                transition-all duration-500 ease-in-out transform ${isVisible ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible'}`}>
                <AboutSkillSection header={skillsSectionData.skillSectionHeader} description={skillsSectionData.skillSectionDescription} />
                <div className='flex gap-10 md:gap-20'>
                    <SkillListSection skills={skillsSectionData.technologySkills} listName='Technologies' />
                    <SkillListSection skills={skillsSectionData.toolsSkills} listName='Tools' />
                </div>
            </div>
        </ScrollTrigger>

    )
}

const AboutSkillSection: React.FC<{ header: string, description: string }> = ({ header, description }) => (
    <div className="about-skill-section flex flex-col max-w-md space-y-3">
        <p className={`skill-header text-center md:text-start md:text-4xl text-3xl font-bold 
            ${montserrat_700.className}`}>{header}</p>
        <p className="skill-description text-center md:text-start text-base text-gray-400">{description}</p>
    </div>
);

const SkillListSection: React.FC<{ skills: SocialIcon[], listName: string }> = ({ skills, listName }) => (
    <div className="skill-list-section flex flex-col items-center gap-5 ">
        <h2 className="text-2xl font-bold">{listName}</h2>
        {skills.map((skill, index) => {
            return (
                <SocialIconComponent
                    key={`${skill.social_name}-${index}`}
                    social_name={skill.social_name}
                    social_link={skill.social_link}
                    icon_url={skill.icon_url}
                    social_fa_icon_color={skill.social_fa_icon_color}
                    social_fa_icon_name={skill.social_fa_icon_name}
                    social_fa_icon_type={skill.social_fa_icon_type}
                    icon_height={skill.icon_height}
                    icon_width={skill.icon_width}
                />
            );
        })}
    </div>
);
