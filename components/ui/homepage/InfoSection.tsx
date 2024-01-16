'use client'
import { SocialIconComponent } from "@/components/SocialIcon";
import { SocialIcon } from "@/lib/definitions";
import { montserrat_700 } from "@/lib/fonts";
import { Image } from "@nextui-org/react";
import { useState } from "react";
import ScrollTrigger from "react-scroll-trigger";

type InfoSectionProps = {
  infoHeader: string;
  infoParagraph: string;
  socialIcons: SocialIcon[]
}

export default function InfoSection({ infoHeader, infoParagraph, socialIcons }: InfoSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  const onEnterViewport = () => {
    setIsVisible(true);
  }

  return (
    <ScrollTrigger onEnter={onEnterViewport}>
      <div id="info-section" className={`md:grid md:grid-cols-2 items-center ml-20 mt-10 md:mt-0 flex flex-col
      md:transition-all transition-opacity duration-500 ease-in-out 
      ${isVisible ? 'md:translate-y-0 opacity-100 visible' : 'md:-translate-y-96 opacity-0 invisible'}`}>
        <div id="info" className="flex flex-col gap-3">
          <p className={`header text-4xl font-bold ${montserrat_700.className}`}>
            {infoHeader}
          </p>
          <p className="description text-base text-gray-400 break-normal">
            {infoParagraph}
          </p>
          <div className="flex flex-wrap space-x-4 items-center">
            {socialIcons.map((item: SocialIcon, index: number) => {
              return (
                <SocialIconComponent
                  key={`${item.social_name}-${index}`}
                  social_name={item.social_name}
                  social_link={item.social_link}
                  social-fa-icon-type={item["social-fa-icon-type"]}
                  social-fa-icon-name={item["social-fa-icon-name"]}
                />
              );
            })}
          </div>
        </div>
        <div className="hidden md:block">
          <Image
            src={'/command-window.gif'}
            alt="coding"
            width={400}
            height={400}
          />
        </div>
      </div>
    </ScrollTrigger>
  );
};
