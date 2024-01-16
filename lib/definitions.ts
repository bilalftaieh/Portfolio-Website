export type Project = {
    project_name: string;
    project_description: string;
    project_website_link: string;
    project_github_link: string
    project_logo: string;
}

export type SocialIcon = {
    social_name: string;
    social_link: string;
    "social-fa-icon-type"?: string;
    "social-fa-icon-name"?: string;
    icon_url?: string;
};
