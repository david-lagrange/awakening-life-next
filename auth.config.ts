import type { NextAuthConfig } from 'next-auth';
import { refreshTokens } from './app/lib/actions/auth/login-actions';

export const authConfig = {
  trustHost: true,
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.emailConfirmed = token.emailConfirmed as boolean;
        session.user.backendExp = token.backendExp as number;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
        session.user.roles = token.roles as string[];
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      // Authentication state
      const authState = {
        isLoggedIn: !!auth?.user,
        isEmailConfirmed: auth?.user?.emailConfirmed as boolean,
        roles: auth?.user?.roles as string[],
      };

      // Current page state
      const currentPage = {
        isOnLoginPage: nextUrl.pathname.startsWith('/auth/login'),
        isOnConfirmEmailPage: nextUrl.pathname.startsWith('/auth/confirm-email'),
        isOnCreateAccountRedirect: nextUrl.pathname.startsWith('/redirects/create-account'),
        isOnCreateAccountPage: nextUrl.pathname.startsWith('/auth/create-account'),
        isOnConfirmEmailRedirect: nextUrl.pathname.startsWith('/redirects/confirm-email'),
        isOnLogoutRedirect: nextUrl.pathname.startsWith('/redirects/logout'),
        isOnRefreshTokensRedirect: nextUrl.pathname.startsWith('/redirects/refresh-tokens'),
        isOnForgotPasswordPage: nextUrl.pathname.startsWith('/auth/forgot-password'),
        isOnResetPasswordPage: nextUrl.pathname.startsWith('/auth/reset-password'),
        isOnProtectedRoute: false, // Will be set below
        isOnSubscriberRoute: false, // Will be set below
      };


      const contemplatorAuthorization = {
        requiredRoles: ['Contemplation', 'Mind Clearing', 'Deepest Vision', 'Gratitude & Goals', 'Manifestation', 'Custom Journey'],
        paths: [
          '/sessions/life-purpose',
          '/sessions/gratitude',
          '/sessions/openness',
          '/sessions/mind-clearing',
          '/sessions/deepest-vision',
          '/sessions/contemplation',
          '/sessions/manifestation',
          '/sessions/custom-journey',
          // Add more feature paths as needed
        ]
      }

      // Protected routes configuration (add each feature/role specific path objects)
      const protectedPaths = [
        '/protected-path',
        '/account',
        '/dashboard',
        '/sessions',
        ...contemplatorAuthorization.paths,
        // Add more protected paths as needed
      ];

      // Set the current page state
      currentPage.isOnProtectedRoute = protectedPaths.some(path => 
        nextUrl.pathname.startsWith(path)
      );

      const currentTimestamp = Math.floor(Date.now() / 1000);
      
      if (auth?.user?.backendExp && auth.user.backendExp < currentTimestamp && !currentPage.isOnLogoutRedirect) {
        return Response.redirect(new URL('/redirects/logout', nextUrl));
      }

      // Allow email confirmation redirect
      if (currentPage.isOnConfirmEmailRedirect) {
        return true;
      }

      // Handle logged-in users non-logged in only pages
      if(
        (authState.isLoggedIn && authState.isEmailConfirmed && currentPage.isOnConfirmEmailPage)
      ||
        (authState.isLoggedIn && currentPage.isOnForgotPasswordPage)
      ||
        (authState.isLoggedIn && currentPage.isOnCreateAccountPage)
      ||
        (authState.isLoggedIn && currentPage.isOnResetPasswordPage)) {
          return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // Handle logged-in users accessing login page
      if (currentPage.isOnLoginPage && authState.isLoggedIn) {
        return Response.redirect(new URL('/redirects/login', nextUrl));
      }

      if (!authState.isLoggedIn && currentPage.isOnConfirmEmailPage){
        return Response.redirect(new URL('/auth/login', nextUrl));
      }
      // Handle email confirmation redirect
      if (authState.isLoggedIn && 
          !authState.isEmailConfirmed && 
          !currentPage.isOnConfirmEmailPage && 
          !currentPage.isOnCreateAccountRedirect &&
          !currentPage.isOnRefreshTokensRedirect) {
        return Response.redirect(new URL('/auth/confirm-email', nextUrl));
      }

      if(authState.isLoggedIn) {

        // Handle feature protections
        
        if (contemplatorAuthorization.paths.some(path => nextUrl.pathname.startsWith(path))) {
          if (contemplatorAuthorization.requiredRoles.every(role => authState.roles.includes(role))) {
            return true;
          }
          return Response.redirect(new URL('/account/manage-subscription', nextUrl));
        }

      }

      // Handle protected routes
      if (currentPage.isOnProtectedRoute) {
        if (authState.isLoggedIn) return true;
        return Response.redirect(new URL('/auth/login', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
