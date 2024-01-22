export type Project = {
    meta:{
        id: number;
    }
    project_overview:string;
    project_name: string;
    project_description: string;
    project_website_link: string;
    project_github_link: string
    project_logo: string;
    project_screenshot:string;
    technologies_used : SocialIcon[]
}

export type SocialIcon = {
    social_name: string;
    social_link: string;
    social_fa_icon_type: string;
    social_fa_icon_name: string;
    social_fa_icon_color: string
    icon_url: string;
    icon_height: number;
    icon_width: number;
};

export type Journey = {
    journey_name: string;
    journey_description: string;
    journey_start_date: string;
    journey_end_date: string;
    journey_image: string;
}
