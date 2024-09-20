import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./prisma";
import Entra from "next-auth/providers/microsoft-entra-id";
import { isProd } from "./utils";
export const { handlers, signIn, signOut, auth } = NextAuth({
  theme:{
    colorScheme: 'light',
    logo: '/eoh.svg',
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    !isProd ? Google :
    Entra({
      clientId: process.env.AUTH_AZURE_AD_ID,
      clientSecret: process.env.AUTH_AZURE_AD_SECRET,
      tenantId: process.env.AUTH_AZURE_AD_TENANT,
    }),
    
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});