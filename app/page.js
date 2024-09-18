import { exempted } from "@/lib/auth";
import HeritageCardGame from "./components/HeritageLatest";
import { CountdownComponent } from "@opherlabs/components";
export default function Home() {
  return (
    <div>
     <pre>
       {JSON.stringify(process.env, null, 2)}
     </pre>
      {
        !exempted.includes(process.env.AUTH_URL) ? <HeritageCardGame />
          : <CountdownComponent targetDate={'2024-09-26T12:00:00'} />
      }
    </div>
  )
}
