'use client'
import { useState } from "react";
import ScrollTrigger from "react-scroll-trigger";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { Image } from "@nextui-org/react";
import { montserrat_700 } from "@/lib/fonts";

interface AboutInfoSectionProps {
  aboutInfodata: {
    aboutInfoHeader: string;
    aboutInfoDescription: string;
    aboutInfoImage: string;
    cvPdf: string;
  }
}

const AboutInfoSection: React.FC<AboutInfoSectionProps> = ({ aboutInfodata }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleEnterViewport = () => setIsVisible(true);
  const handleExitViewport = () => setIsVisible(false);

  const sanitizedAboutInfoDescription = DOMPurify.sanitize(aboutInfodata.aboutInfoDescription);

  return (
    //@ts-ignore
    <ScrollTrigger onEnter={handleEnterViewport} onExit={handleExitViewport}>
      <div id="info-section" className={`info-section-container md:grid md:grid-cols-3 items-center gap-5 md:gap-20 md:ml-20 md:mt-10 mt-3 p-5 md:p-0
        flex flex-col-reverse md:transition-all transition-opacity duration-500 ease-in-out 
        ${isVisible ? 'md:translate-y-0 opacity-100 visible' : 'md:-translate-y-96 opacity-0 invisible'}`}>
        <Info aboutInfoHeader={aboutInfodata.aboutInfoHeader} aboutInfoDescription={sanitizedAboutInfoDescription} />
        <Resume aboutInfoImage={aboutInfodata.aboutInfoImage} cvPdf={aboutInfodata.cvPdf} />
      </div>
    </ScrollTrigger>
  );
}

const Info: React.FC<{ aboutInfoHeader: string, aboutInfoDescription: string }> = ({ aboutInfoHeader, aboutInfoDescription }) => (
  <div id="info" className="info-container flex flex-col gap-3 md:col-span-2">
    <p className={`info-header text-center text-2xl md:text-3xl font-bold ${montserrat_700.className}`}>{aboutInfoHeader}</p>
    <div className="info-description text-center text-base" dangerouslySetInnerHTML={{ __html: aboutInfoDescription }} />
  </div>
);

const Resume: React.FC<{ aboutInfoImage: string, cvPdf: string }> = ({ aboutInfoImage, cvPdf }) => (
  <div className="resume-container flex flex-col gap-4 md:col-span-1">
    <Image src={aboutInfoImage} alt="Personal Image" width={200} height={200} className="resume-image" />
    <Link href={cvPdf}>
      <div className="resume-link px-4 py-2 bg-inherit rounded text-white hover:text-gray-400 cursor-pointer">
        View Resume <i className="fa-solid fa-arrow-up-right-from-square ml-3"></i>
      </div>
    </Link>
  </div>
);

export default AboutInfoSection;
