import InfoSection from "@/components/ui/home/InfoSection";
import ProjectSection from "@/components/ui/home/HomePageProjectsSection";
import { fetchPages } from "@/lib/butterCmsApi";
import { Divider } from "@nextui-org/react";

export default async function HomePage() {

  const pages = await fetchPages();

  const homePageFields = pages[0].fields
  const infoHeader = homePageFields.landing_caption;
  const infoDescription = homePageFields.landing_main_text;
  const socialIcons = homePageFields.social_icons

  const projectData = {
    homeProjectSectionHeader: homePageFields.landing_page_project_section_header,
    homeProjectSectionDescription: homePageFields.landing_page_project_section_description,
    homeProjectSectionProjects: homePageFields.personal_projects
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <InfoSection infoHeader={infoHeader} infoParagraph={infoDescription}
        socialIcons={socialIcons} />
      <Divider className="bg-custom-three" />
      <ProjectSection projectData={projectData} />
    </div>
  );
}
