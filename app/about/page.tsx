import AboutInfoSection from "@/components/ui/about/AboutInfoSection";
import JourneySection from "@/components/ui/about/JourneySection";
import SkillsSection from "@/components/ui/about/SkillsSection";
import { fetchPages } from "@/lib/butterCmsApi"
import { Divider } from "@nextui-org/react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Belal Alfutayh | About',
    description: 'Belal Alfutayh About Page that includes his background and skills',
  }

export default async function AboutPage() {
    const pages = await fetchPages();
    const aboutPageFields = pages[3].fields;

    const aboutInfoSectionData = {
        aboutInfoHeader: aboutPageFields.about_info_header,
        aboutInfoDescription: aboutPageFields.about_info_text,
        aboutInfoImage: aboutPageFields.about_info_image,
        cvPdf: aboutPageFields.cv_pdf
    }

    const journeySectionData = {
        aboutJourneyHeader: aboutPageFields.about_journey_header,
        aboutJourneyDescription: aboutPageFields.about_journey_description,
        journeyList: aboutPageFields.journey_list
    }

    const skillsSectionData = {
        skillSectionHeader: aboutPageFields.skills_section_header,
        skillSectionDescription: aboutPageFields.skills_section_description,
        technologiesHeader: aboutPageFields.technologies_header,
        toolsHeader: aboutPageFields.tools_header,
        technologySkills: aboutPageFields.technology_skills,
        toolsSkills: aboutPageFields.tools_skills
    }

    return (
        <div className="flex flex-col gap-5">
            <AboutInfoSection aboutInfodata={aboutInfoSectionData} />
            <Divider className="bg-custom-three" />
            <JourneySection journeySectionData={journeySectionData} />
            <Divider className="bg-custom-three" />
            <SkillsSection skillsSectionData={skillsSectionData} />
        </div>
    )
}