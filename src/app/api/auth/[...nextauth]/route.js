import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from '@/libs/db';
import bcrypt from 'bcrypt';

// Ensure NEXTAUTH_URL is set for production
const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
const useSecureCookies = process.env.NODE_ENV === 'production';

// For Vercel deployments
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email o Usuario", type: "text", placeholder: "usuario o email" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials, req) {
        console.log(credentials)

        // Buscar por email o username
        await db.$connect();
        const userFound = await db.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ]
          }
        });
        await db.$disconnect();

        if (!userFound) throw new Error('Usuario no encontrado')

        console.log(userFound)

        const matchPassword = await bcrypt.compare(credentials.password, userFound.password)

        if (!matchPassword) throw new Error('Contraseña incorrecta')

        return {
          id: userFound.id,
          name: userFound.username,
          email: userFound.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: vercelUrl ? '.mamen-noticias.vercel.app' : undefined
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: useSecureCookies,
  callbacks: {
    async jwt({ token, user }) {
      // Add user id to the token right after sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session?.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If a callback URL is provided, use it
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        return url;
      }
      // Fallback to base URL if nothing matches
      return baseUrl;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
