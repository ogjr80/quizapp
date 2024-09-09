import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Twitter from "next-auth/providers/twitter"
import GitHub from "next-auth/providers/github"
import Entra from "next-auth/providers/microsoft-entra-id";
import { env } from "process";
export const { handlers, signIn, signOut, auth } = NextAuth({
  theme:{
    colorScheme: 'light',
    logo: '/eoh.png',
  },
  debug: env.NODE_ENV === "development",
  providers: [
    Google,
    Twitter,
    GitHub,
    Entra({
      clientId: env.AUTH_AZURE_AD_ID,
      clientSecret: env.AUTH_AZURE_AD_SECRET,
      tenantId: env.AUTH_AZURE_AD_TENANT,
    })
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
});
