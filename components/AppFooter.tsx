import { SocialIcon } from "@/lib/definitions";
import { SocialIconComponent } from "./SocialIcon";

interface FooterSectionProps {
  data: {
    app_made_by: string;
    attribution_text: string;
    github_repo_text: string;
    social_icons: SocialIcon[];
    attribution_icons: SocialIcon[];
    github_repo: SocialIcon[];
    contact: SocialIcon[];
    copyright_notice: string;
  }
};

export default function AppFooter({ data }: FooterSectionProps) {
  const {
    app_made_by,
    attribution_text,
    github_repo_text,
    social_icons,
    attribution_icons,
    github_repo,
    contact,
    copyright_notice
  } = data;

  const renderSocialIcons = (icons: SocialIcon[]) => {
    return icons.map((icon, index) => (
      <SocialIconComponent
        key={`${icon.social_name}-${index}`}
        social_name={icon.social_name}
        social_link={icon.social_link}
        icon_url={icon.icon_url}
        icon_height={icon.icon_height}
        icon_width={icon.icon_width}
        social_fa_icon_type={icon.social_fa_icon_type}
        social_fa_icon_name={icon.social_fa_icon_name}
        social_fa_icon_color={icon.social_fa_icon_color}
      />
    ));
  };

  return (
    <footer className="app-footer md:flex grid grid-cols-2 gap-10 p-4 bg-inherit text-center text-white">
      <div className="made-by-section flex flex-col items-center gap-3">
        <p className="app-made-by font-bold text-lg">{app_made_by}</p>
        {renderSocialIcons(social_icons)}
      </div>

      <div className="attribution-section flex flex-col items-center gap-3">
        <p className="attribution-text font-bold text-lg">{attribution_text}</p>
        {renderSocialIcons(attribution_icons)}
      </div>

      <div className="github-repo-section flex flex-col items-center gap-3">
        <p className="github-repo-text font-bold text-lg">{github_repo_text}</p>
        {renderSocialIcons(github_repo)}
      </div>

      <div className="contact-section flex flex-col items-center gap-3">
        <p className="contact-text font-bold text-lg">Contact</p>
        {renderSocialIcons(contact)}
      </div>

      <div className="copyright-section flex md:items-center justify-center">
        <p id="copyright-notice">{copyright_notice}</p>
      </div>
    </footer>
  );
}
