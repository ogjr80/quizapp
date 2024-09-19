'use client';
import { QuizCards, CardsHolder, CountdownComponent } from "@opherlabs/components";
import React from "react";
import { files } from "../universe/quizdata";
import { isProd } from "@/lib/utils";
export default function Home() {
  const gameStartDate = new Date("September 26, 2024 20:00:00").getTime();
  const now = new Date().getTime();
  const timeLeft = gameStartDate - now;
  return (
    <div>
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
