import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Entra from "next-auth/providers/microsoft-entra-id";
const url = `${process.env.AUTH_URL}`;
export const exempted = ["https://unityindiversity.co.za/","https://www.unityindiversity.co.za/"];
export const { handlers, signIn, signOut, auth } = NextAuth({
  theme:{
    colorScheme: 'light',
    logo: '/eoh.png',
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    Entra({
      clientId: process.env.AUTH_AZURE_AD_ID,
      clientSecret: process.env.AUTH_AZURE_AD_SECRET,
      tenantId: process.env.AUTH_AZURE_AD_TENANT,
    }),
    !exempted.includes(url) && Google 
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});