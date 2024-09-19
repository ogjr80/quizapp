'use client';
import { QuizCards, CardsHolder } from "@opherlabs/components";
import React from "react";
import { files } from "../universe/quizdata";
export default function Home() {
    return (
        <div>
            <CardsHolder>
                <QuizCards url="public" files={files} />
            </CardsHolder>

        </div>
    )
}
