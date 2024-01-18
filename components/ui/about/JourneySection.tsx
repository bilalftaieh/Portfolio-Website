'use client'
import { useState } from 'react';
import ScrollTrigger from 'react-scroll-trigger';
import { montserrat_700 } from "@/lib/fonts";
import { Journey } from '@/lib/definitions';
import JourneyComponent from './JourneyComponent';

interface JourneySectionProps {
    journeySectionData: {
        aboutJourneyHeader: string;
        aboutJourneyDescription: string;
        journeyList: Journey[]
    }
}

const JourneySection: React.FC<JourneySectionProps> = ({ journeySectionData }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleEnterViewport = () => setIsVisible(true);
    const handleExitViewport = () => setIsVisible(false);

    return (
        //@ts-ignore
        <ScrollTrigger onEnter={handleEnterViewport} onExit={handleExitViewport}>
            <div className={`journey-section p-5 md:p-0 flex flex-col md:ml-20 space-y-5 mt-5 break-words
                transition-all duration-500 ease-in-out transform ${isVisible ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible'}`}>
                <AboutJourneySection header={journeySectionData.aboutJourneyHeader} description={journeySectionData.aboutJourneyDescription} />
                <JourneyListSection journeys={journeySectionData.journeyList} />
            </div>
        </ScrollTrigger>
    );
}

const AboutJourneySection: React.FC<{ header: string, description: string }> = ({ header, description }) => (
    <div className="about-journey-section flex flex-col max-w-md space-y-3">
        <p className={`journey-header text-center md:text-start md:text-4xl text-3xl font-bold 
            ${montserrat_700.className}`}>{header}</p>
        <p className="journey-description text-center md:text-start
        text-base  text-gray-400">{description}</p>
    </div>
);

const JourneyListSection: React.FC<{ journeys: Journey[] }> = ({ journeys }) => (
    <div className="journey-list-section flex flex-col items-center gap-y-10 ">
        {journeys.map((journey, index) => (
            <JourneyComponent key={`${journey.journey_name}-${index}`} journey={journey} />
        ))}
    </div>
);

export default JourneySection;
