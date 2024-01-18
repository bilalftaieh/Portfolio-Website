'use client'
import { useState } from "react";
import ScrollTrigger from "react-scroll-trigger";
import { SocialIconComponent } from "@/components/SocialIcon";
import { SocialIcon } from "@/lib/definitions";
import { montserrat_700 } from "@/lib/fonts";
import { Image } from "@nextui-org/react";

type InfoSectionProps = {
  infoHeader: string;
  infoParagraph: string;
  socialIcons: SocialIcon[]
}

export default function InfoSection({ infoHeader, infoParagraph, socialIcons }: InfoSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleEnterViewport = () => {
    setIsVisible(true);
  }

  return (
    //@ts-ignore
    <ScrollTrigger onEnter={handleEnterViewport}>
      <div id="info-section" className={`info-section-container md:grid md:grid-cols-2 items-center 
      mt-5 md:mt-0 flex flex-col ml-5 md:ml-20 
      md:transition-all transition-opacity duration-500 ease-in-out 
      ${isVisible ? 'md:translate-y-0 opacity-100 visible' : 'md:-translate-y-96 opacity-0 invisible'}`}>
        <Info infoHeader={infoHeader} infoParagraph={infoParagraph} socialIcons={socialIcons} />
        <ImageContainer />
      </div>
    </ScrollTrigger>
  );
}

const Info: React.FC<{ infoHeader: string, infoParagraph: string, socialIcons: SocialIcon[] }> = ({ infoHeader, infoParagraph, socialIcons }) => (
  <div id="info" className="info-container flex flex-col gap-3">
    <p className={`info-header text-4xl font-bold ${montserrat_700.className}`}>{infoHeader}</p>
    <p className="info-description text-base text-gray-400 break-normal">{infoParagraph}</p>
    <SocialIcons socialIcons={socialIcons} />
  </div>
);

const SocialIcons: React.FC<{ socialIcons: SocialIcon[] }> = ({ socialIcons }) => (
  <div className="social-icons-container flex flex-wrap space-x-4 items-center">
    {socialIcons.map((item: SocialIcon, index: number) => (
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
    ))}
  </div>
);

const ImageContainer: React.FC = () => (
  <div className="image-container hidden md:block">
    <Image
      src={'/command-window.gif'}
      alt="coding"
      width={400}
      height={400}
    />
  </div>
);

