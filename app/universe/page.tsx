'use client';
import { CardsHolder, CountdownComponent, QuizCards } from "@opherlabs/components";
import React from "react";
import { files } from "./quizdata";
export default function Home() {
  const target = new Date("September 26, 2024 20:00:00").getTime();
  const now = new Date().getTime();
  const timeLeft = target - now;
  return (
    <div>
          { timeLeft<=0?<>
            <CardsHolder>
                <QuizCards url="universe" files={files} />
            </CardsHolder></> : CountdownComponent({ url: '/api/auth/signin', targetDate: '2024-09-26T20:00:00' })}
    </div>
  )
}
