import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Entra from "next-auth/providers/microsoft-entra-id";
const exemptedList = ["https://unityindiversity.co.za","https://www.unityindiversity.co.za"];
const url = exemptedList.includes(`${process.env.AUTH_URL}`);
export const { handlers, signIn, signOut, auth } = NextAuth({
  theme:{
    colorScheme: 'light',
    logo: '/eoh.png',
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    !url ? Google :
    Entra({
      clientId: process.env.AUTH_AZURE_AD_ID,
      clientSecret: process.env.AUTH_AZURE_AD_SECRET,
      tenantId: process.env.AUTH_AZURE_AD_TENANT,
    }),
    
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});