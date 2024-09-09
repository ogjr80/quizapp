import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
export default async function AuthProvider({children}) {
    const {data: session} = auth();
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
