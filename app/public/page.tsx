'use client';
import { QuizCards, CardsHolder, CountdownComponent } from "@opherlabs/components";
import React from "react";
import { files } from "../universe/quizdata";
import { exemptedList } from "@/lib/utils";
export default function Home() {
    // const isProd = exemptedList.includes(process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_URL)

   
    return (
        <div>
            <CardsHolder>
                <QuizCards url="universe" files={files} />
            </CardsHolder>

        </div>
    )
}
