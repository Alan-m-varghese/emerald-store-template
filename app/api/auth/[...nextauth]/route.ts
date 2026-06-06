import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/prisma";
import { dbMock } from "@/lib/dbMock";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        // Try Prisma database first (if configured and online)
        try {
          const user = await db.user.findUnique({
            where: { email }
          });
          if (user && user.passwordHash === password) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            };
          }
        } catch (e) {
          console.warn("Database connection issue, checking dbMock fallback:", e);
        }

        // Fallback to dbMock
        const mockUser = dbMock.findUserByEmail(email);
        if (mockUser && mockUser.passwordHash === password) {
          return {
            id: mockUser.email, // using email as ID for mock users
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "emerald-secret-fallback-12345"
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
