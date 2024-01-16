import { SocialIcon } from "@/lib/definitions";
import { SocialIconComponent } from "./SocialIcon";

interface FooterSectionProps {
  data: {
    app_made_by: string;
    attribution_text: string;
    github_repo_text: string;
    social_icons: SocialIcon[];
    attribution_icons: SocialIcon[]
    github_repo: SocialIcon[]
  }
};

export default function AppFooter({ data }: FooterSectionProps) {
  return (
    <footer className="flex gap-20 p-4 bg-inherit text-center text-white">
      <div className="flex flex-col items-center gap-3">
        <p className="font-bold text-lg">{data.app_made_by}</p>
        {data.social_icons.map((item, index) => {
          return <SocialIconComponent
            key={`${item.social_name}-${index}`}
            social_name={item.social_name}
            social_link={item.social_link}
            icon_url={item.icon_url ? item.icon_url : undefined}
            social-fa-icon-type={item.icon_url ? undefined : item["social-fa-icon-type"]}
            social-fa-icon-name={item.icon_url ? undefined : item["social-fa-icon-name"]}
          />
        })}
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="font-bold text-lg">{data.attribution_text}</p>
        {data.attribution_icons.map((item, index) => {
          return <SocialIconComponent
            key={`${item.social_name}-${index}`}
            social_name={item.social_name}
            social_link={item.social_link}
            icon_url={item.icon_url ? item.icon_url : undefined}
            social-fa-icon-type={item.icon_url ? undefined : item["social-fa-icon-type"]}
            social-fa-icon-name={item.icon_url ? undefined : item["social-fa-icon-name"]}
          />
        })}
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="font-bold text-lg">{data.github_repo_text}</p>
        <SocialIconComponent
          social_name={data.github_repo[0].social_name}
          social-fa-icon-name={data.github_repo[0]["social-fa-icon-name"]}
          social-fa-icon-type={data.github_repo[0]["social-fa-icon-type"]}
          social_link={data.github_repo[0].social_link}
        />

      </div>
    </footer>
  )
}

