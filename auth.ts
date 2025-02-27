import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { JWT } from 'next-auth/jwt';
import { DefaultSession } from 'next-auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const createFetchOptions = (body: any) => ({
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(body)
});

const refreshAccessToken = async (refreshToken: string, accessToken: string): Promise<{ accessToken: string; refreshToken: string; exp: number; } | null> => {
  try {
    const response = await fetch(
      `${API_URL}/api/token/refresh`,
      createFetchOptions({ 
        accessToken,
        refreshToken 
      })
    );

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const refreshedTokens = await response.json();
    
    // Decode the new JWT payload
    const [, payloadBase64] = refreshedTokens.accessToken.split('.');
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());

    return {
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken,
      exp: payload.exp
    };
  } catch (error) {
    return null;
  }
};

interface UserProperties {
  id?: string;
  email?: string;
  name?: string;
  roles?: string[];
  emailConfirmed?: boolean;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    expires: string;
    user?: UserProperties & DefaultSession['user']
  }

  interface User extends UserProperties {
    accessToken?: string;
    refreshToken?: string;
    exp?: number;
    backendExp?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    refreshToken?: string;
    accessToken?: string;
    exp?: number;
  }
}

const handler = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // If the credentials object contains an accessToken & refreshToken,
        // then we'll assume this is a refresh request.
        if (
          credentials &&
          typeof credentials.accessToken === 'string' &&
          typeof credentials.refreshToken === 'string'
        ) {
          console.log('Credentials is access/refresh tokens');
          const refreshedTokens = await refreshAccessToken(
            credentials.refreshToken,
            credentials.accessToken
          );

          if (!refreshedTokens) return null;

          // Decode the payload from the refreshed access token.
          const [, payloadBase64] = refreshedTokens.accessToken.split('.');
          const payload = JSON.parse(
            Buffer.from(payloadBase64, 'base64').toString()
          );

          return {
            id: payload.userId,
            email: payload.email,
            name: payload.username,
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken,
            roles: payload.roles,
            exp: payload.exp,
            emailConfirmed: payload.emailConfirmed === 'true'
          };
        }

        console.log('Credentials is email/password');
        // Otherwise, assume this is a regular email/password login.
        const parsedCredentials = z
          .object({
            email: z.string(),
            password: z.string().min(6)
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        try {
          const response = await fetch(
            `${API_URL}/api/authentication/login`,
            createFetchOptions({ email, password })
          );

          if (!response.ok) {
            const errorData = await response.text();
            console.log('Authentication API Error:', errorData);
            return null;
          }

          const authResponse = await response.json();
          const [, payloadBase64] = authResponse.accessToken.split('.');
          const user = JSON.parse(
            Buffer.from(payloadBase64, 'base64').toString()
          );

          return {
            id: user.userId,
            email: user.email,
            name: user.username,
            accessToken: authResponse.accessToken,
            refreshToken: authResponse.refreshToken,
            roles: user.roles,
            exp: user.exp,
            emailConfirmed: user.emailConfirmed === 'true'
          };
        } catch (error) {
          console.error('Authentication Exception caught:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          ...user,
          emailConfirmed: user.emailConfirmed,
          backendExp: user.exp
        };
      }

      if (token.accessToken) {
        const [, payloadBase64] = token.accessToken.split('.');
        const payload = JSON.parse(
          Buffer.from(payloadBase64, 'base64').toString()
        );
        token.exp = payload.exp;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = token.backendExp as number - currentTime;
      const expiresInMinutes = Math.floor(expiresIn / 60);
      const expiresInSeconds = expiresIn % 60;
      
      console.log(
        `Token expires in ${expiresInMinutes}m ${expiresInSeconds}s (at ${new Date(
          token.exp! * 1000
        ).toLocaleString()})`
      );

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          roles: token.roles as string[],
          emailConfirmed: token.emailConfirmed as boolean,
          emailVerified: null
        };
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;

        const exp = (token.backendExp as number) || (token.exp as number);
        session.expires = new Date(exp * 1000).toISOString() as Date & string;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  }
}); 

export const { auth, signIn, signOut } = handler; 

export { authConfig };