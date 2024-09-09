import { auth } from "@/lib/auth";
import { Divide } from "lucide-react";
import { SessionProvider } from "next-auth/react";
export default async function AuthProvider({children}) {
    // const {data: session} = auth();
  return (
    <div>
    {/* <SessionProvider session={session}> */}
      {children}
    {/* </SessionProvider> */}
    </div>
    
  )
}
