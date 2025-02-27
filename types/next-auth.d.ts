import 'next-auth';

declare module 'next-auth' {
  interface User {
    accessToken?: string;
  }
  interface Session {
    accessToken?: string;
  }
  interface JWT {
    accessToken?: string;
  }
} 