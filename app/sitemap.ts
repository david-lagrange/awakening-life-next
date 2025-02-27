

export default async function sitemap() {
    const baseUrl = 'https://somedomain.com';

    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
        }
    ];

    const pagesSection = [
        {
            url: `${baseUrl}/some-path`,
            lastModified: new Date(),
        }
    ];

    return [...staticPages, ...pagesSection];
} 