require('dotenv').config()
const butterCmsPageBaseUrl = process.env.BUTTER_CMS_PAGE_BASE_URL;
const butterCmsCollectionBaseUrl = process.env.BUTTER_CMS_COLLECTION_BASE_URL;
const butterCmsApiToken = `auth_token=${process.env.BUTTER_CMS_API_TOKEN}`

const requestParams = {
    pages: `${butterCmsPageBaseUrl}/portfolio/a-portfolio-site/?preview=1&${butterCmsApiToken}`,
    personalProjects: `${butterCmsCollectionBaseUrl}/personal_software_projects/?${butterCmsApiToken}`
}

export async function fetchPages() {
    console.log(`Fetching ${requestParams.pages}`)
    try {
        const response = await fetch(`${requestParams.pages}`,
            {
                cache: 'no-cache'
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data.fields.my_portfolio_project;
    } catch (e) {
        console.error('An error occurred while fetching the pages:', e);
        return null;
    }
}

export async function fetchProjectSection() {
    console.log(`Fetching ${requestParams.pages}`)
    try {
        const response = await fetch(`${requestParams.pages}`,
            {
                cache: 'no-cache'
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // await new Promise((resolve) => setTimeout(resolve, 3000));
        const data = await response.json();
        return data.data.fields.my_portfolio_project[1];
    } catch (e) {
        console.error('An error occurred while fetching the pages:', e);
        return null;
    }
}



