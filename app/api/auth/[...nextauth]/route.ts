import NextAuth from 'next-auth';
import { authConfig } from '@/auth';

/**
 * Lazy initialization: NextAuth is provided a single configuration object,
 * and it returns an object with built-in HTTP method handlers in the `handlers` property.
 */
const { handlers } = NextAuth(authConfig);

// Export the GET and POST handlers from handlers.
export const GET = handlers.GET;
export const POST = handlers.POST;