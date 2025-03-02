export default async function sitemap() {
    const baseUrl = 'https://awakeninglife.ai';

    // Public pages that should be indexed
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/auth/login`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/auth/create-account`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/auth/forgot-password`,
            lastModified: new Date(),
        }
    ];

    // Legal pages section
    const legalPages = [
        {
            url: `${baseUrl}/legal/user/terms-of-service`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/legal/user/privacy-policy`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/legal/api/terms-of-service`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/legal/api/privacy-policy`,
            lastModified: new Date(),
        }
    ];

    // Session pages that are publicly accessible
    const sessionPages = [
        {
            url: `${baseUrl}/sessions/technique-training`,
            lastModified: new Date(),
        }
    ];

    // Exclude authenticated/private routes:
    // - /account/* (profile, billing)
    // - /dashboard
    // - /auth/reset-password (contains tokens)

    return [...staticPages, ...legalPages, ...sessionPages];
} 