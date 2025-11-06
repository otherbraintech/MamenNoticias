import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from '@/libs/db';
import bcrypt from 'bcrypt';

// Configuración de URLs
const isProduction = process.env.NODE_ENV === 'production';
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
const baseUrl = process.env.NEXTAUTH_URL || vercelUrl || 'http://localhost:3000';

// Configuración de cookies para producción
const cookiePrefix = isProduction ? '__Secure-' : '';
const cookieDomain = isProduction ? '.mamen-noticias.vercel.app' : undefined;
const useSecureCookies = isProduction;

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
    maxAge: 30 * 24 * 60 * 60, // 30 días
    updateAge: 24 * 60 * 60, // Actualizar la sesión cada 24 horas
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: cookieDomain,
        maxAge: 30 * 24 * 60 * 60 // 30 días
      }
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: cookieDomain
      }
    },
    csrfToken: {
      name: `${cookiePrefix}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: cookieDomain
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: useSecureCookies,
  logger: {
    error(code, metadata) {
      console.error('NextAuth error:', { code, ...metadata });
    },
    warn(code) {
      console.warn('NextAuth warning:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth debug:', { code, ...metadata });
    }
  },
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
      // En producción, forzar el uso de HTTPS si es necesario
      const productionUrl = baseUrl.replace('http://', 'https://');
      
      // Si la URL es relativa o pertenece a nuestro dominio, usarla
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        return url;
      }
      
      // Si es una URL de callback de NextAuth, asegurarse de que use HTTPS en producción
      if (isProduction && url.startsWith('http://')) {
        return url.replace('http://', 'https://');
      }
      
      // Por defecto, redirigir al dashboard
      return `${productionUrl}/dashboard`;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
