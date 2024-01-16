import InfoSection from "@/components/ui/homepage/InfoSection";
import ProjectSection from "@/components/ui/homepage/ProjectSection";
import { fetchPages} from "@/lib/butterCmsApi";
import { Divider } from "@nextui-org/react";

export default async function HomePage() {

  const pages = await fetchPages();

  const infoHeader = pages[0].fields.landing_caption;
  const infoDescription = pages[0].fields.landing_main_text;
  const socialIcons = pages[0].fields.social_icons


  return (
    <div className="flex flex-col space-y-7">
      <InfoSection infoHeader={infoHeader} infoParagraph={infoDescription}
        socialIcons={socialIcons} />
      <Divider className="bg-custom-three" />
      <ProjectSection projectPage={pages[1].fields} />
    </div>
  );
}
