'use client';
import { QuizCards, CardsHolder, CountdownComponent } from "@opherlabs/components";
import React from "react";
import { files } from "../universe/quizdata";
import { exemptedList } from "@/lib/utils";
export default function Home() {
const isProd=exemptedList.includes(process.env.AUTH_URL?? process.env.NEXT_PUBLIC_URL)

  const gameStartDate = new Date("September 26, 2024 20:00:00").getTime();
  const now = new Date().getTime();
  const timeLeft = gameStartDate - now;
  return (
    <div>
        <pre>
            {JSON.stringify({isProd, url:process.env.__NEXT_PRIVATE_ORIGIN??process.env.NEXT_PUBLIC_URL}, null, 2)}
        </pre>
      {
        !isProd || timeLeft <= 0 ? 
        <CardsHolder>
        <QuizCards url="universe" files={files} />
      </CardsHolder>
          : CountdownComponent({ url: '/api/auth/signin', targetDate: '2024-09-26T20:00:00' })
      }
      
    </div>
  )
}
