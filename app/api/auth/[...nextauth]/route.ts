'use server'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.account.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          return null
        }

        return {
          id: user.email,
          email: user.email,
          name: user.username,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      if (trigger === "update") {
        const dbUser = await prisma.account.findUnique({ where: { email: token.email } });
        token.id = dbUser.email;
        token.name = dbUser.username;
        token.email = dbUser.email;
      }

      // // Refreshes JWT every 5 minutes, not leaving this in because I like keeping my free hosting credits
      // const refreshInterval = 5 * 60000; // in ms
      // const shouldRefresh = !token.lastFetched || Date.now() - (token.lastFetched as number) > refreshInterval;
    
      // if (shouldRefresh) {
      //   const dbUser = await prisma.account.findUnique({ where: { email: token.email } });
      //   token.id = dbUser.email;
      //   token.name = dbUser.username;
      //   token.email = dbUser.email;
      //   token.lastFetched = Date.now();
      // }
    
      return token;
    },
    async session({ session, token }) {
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
