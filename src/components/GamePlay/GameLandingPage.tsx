'use client'
import React, { useState } from 'react'
import { AnimatedBackground } from '../CountDown'
import { ChoiceButton } from './CoiceButton'
import { quizData } from '@/data/QuizData'
import { useParams, useRouter } from 'next/navigation'
import { Question } from '@/types'
import { usePoints } from "@/hooks/usePoints";

// New component for multiple choice buttons


export const GameLandingPage = () => {
    const { id } = useParams()
    const [score, setScore] = useState(0);
    const router = useRouter()
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [selectedChoice, setSelectedChoice] = useState(null)
    const { questions } = quizData[Number(1)];
    const question: Question = questions[currentQuestion];
    const { submitQuizScore } = usePoints();

    const handleGameEnd = async () => {
        try {
            console.log("Quiz score submitted:");
            router.push('/public');
        } catch (error) {
            console.error("Failed to submit quiz score:", error);
        }
    };

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(score + 1);
        }

        if (currentQuestion < 3) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleGameEnd();
        }
    };

    return (
        <div className='min-h-screen'>
            <AnimatedBackground />
            <div className="flex justify-center items-center text-gray-700 min-h-screen">
                <div className="flex flex-col items-center px-16 py-8 mx-auto bg-white/95 text-black rounded-xl z-40 min-h-[40rem] max-w-5xl w-full relative">
                    {/* Centered icon with gold background */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-yellow-500 rounded-full p-4">
                        {/* Replace this div with your actual icon component */}
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                            <span className="text-2xl">🏆</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-center mb-8 mt-8">Unity in Diversity: A Cultural Celebration Game</h1>

                    <div className="w-full max-w-md">
                        {/* {choices.map((choice, index) => (
                            <ChoiceButton
                                key={index}
                                text={choice}
                                isSelected={selectedChoice === index}
                                onClick={() => setSelectedChoice(index as unknown as null)}
                            />
                        ))} */}
                    </div>

                    <div className="text-xl mb-6">Score: {score}/10</div>
                    <h2 className="text-2xl mb-4">{question.text}</h2>
                    <div className="space-y-4">
                        {question.options.map((option: any, index: any) => (
                            <ChoiceButton
                                isSelected={selectedChoice === index}
                                key={index}
                                text={option.text}
                                onClick={() => handleAnswer(option.isCorrect)}
                            // className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                            >

                            </ChoiceButton>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameLandingPage