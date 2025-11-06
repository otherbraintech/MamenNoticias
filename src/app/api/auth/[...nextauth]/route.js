import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from '@/libs/db'
import bcrypt from 'bcrypt'

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
        const userFound = await db.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ]
          }
        })

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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle relative URLs
      if (url.startsWith('/')) {
        // Ensure we don't redirect back to login if already authenticated
        if (url === '/auth/login') {
          return `${baseUrl}/dashboard`;
        }
        return `${baseUrl}${url}`;
      }
      // Handle absolute URLs
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default to dashboard if no URL is provided
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
