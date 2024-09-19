'use client';
import { QuizCards, CardsHolder, CountdownComponent } from "@opherlabs/components";
import React from "react";
import { files } from "../universe/quizdata";
export default function Home() {
  const [hostname, setHostname] = React.useState('');
  React.useEffect(() => {
    setHostname(window.location.hostname);
  }, []);
  const gameStartDate = new Date("September 26, 2024 20:00:00").getTime();
  const now = new Date().getTime();
  const timeLeft = gameStartDate - now;
  const exemptedList = ["unityindiversity.co.za", "www.unityindiversity.co.za"];
  const isPriod=exemptedList.includes(process.env.__NEXT_PRIVATE_ORIGIN)
  return (
    <div>
      {
        !isPriod || timeLeft <= 0 ? 
        <CardsHolder>
        <QuizCards url="universe" files={files} />
      </CardsHolder>
          : CountdownComponent({ url: '/api/auth/signin', targetDate: '2024-09-26T20:00:00' })
      }
      
    </div>
  )
}
