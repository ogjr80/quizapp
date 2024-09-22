"use client";
import { useQuestions } from "@/hooks/stores/useQuestions";
import { useScores } from "@/hooks/stores/useScores";
import { useGameSession } from "@/hooks/useGameSession";
import { usePoints } from "@/hooks/usePoints";
import { isFull } from "@/lib/shuffleQuestions";
import { ScoreTypes } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import GameSessionTimer from "./GameSessionTimer";

type Question = {
    question: string;
    options: string[];
    correctAnswer: string;
    timer: number;
};

type FileItem = {
    id: string;
    title: string;
    source: string;
    bgColor: string;
    type: ScoreTypes
    questions: Question[];
};

interface FileDetailProps {
    files: FileItem[]
    url: string;
}

export const QuizComponent: React.FC<FileDetailProps> = ({ files, url, }) => {
    const router = useRouter()
    const { submitQuizScore, points } = usePoints()
    const { session: gameSession, } = useGameSession()
    const { id } = useParams()
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const { current } = useQuestions() as any
    const handleStorytellingOrChallenge = () => { }
    const handleAnswerCheck = async (option: string) => {
        setSelectedOption(option)
        const intra = points?.intraScores.find((s: any) => s.type === current.type)
        let score = 0
        if (option === current.correctAnswer) {
            score = 1
        }

        await submitQuizScore.mutateAsync({
            score, idtype: curentSet.type, question: current.question
        })
        return router.push(`/${url}`)
    }
    const curentSet: FileItem = files.find(e => e.id === id) as FileItem
    const isButtonDisabled = selectedOption !== null;

    return (
        <div className="mx-auto h-screen p-10 my-5 lg:px-8">
            <div className="bg-cover bg-center rounded-lg h-full relative">
                <button
                    className="absolute top-4 right-4 bg-red-600 p-2 rounded-full text-white text-3xl"
                    onClick={() => router.push(`/${url}`)}
                >
                    <FaTimes />
                </button>
                {gameSession && <div
                    className="absolute top-4 left-0 bg-white-600 p-2 rounded-r-full text-white text-3xl"
                >
                    {(gameSession as any)['isActive'] ?? 0}
                </div>
                }

                <div className="flex items-center justify-center h-full w-full">
                    <div className="relative rounded-lg shadow-lg max-w-md w-full">
                        <div className="bg-cover bg-center rounded-t-lg p-6" style={{ backgroundColor: curentSet.bgColor }}>
                            <h2 className="text-2xl font-bold text-center text-white mb-2">
                                {curentSet?.title}
                            </h2>
                            <p className="text-center text-white">
                                {current?.question}
                            </p>
                            <p className="text-center text-white mt-2">
                                {/* Current Team: */}
                            </p>
                        </div>
                        <div className="bg-white rounded-b-lg p-6">
                            {curentSet?.type === 'DIVERSITY' && current?.options.map((option: string) => (
                                <button
                                    key={option}
                                    className={`w-full p-4 text-left rounded mb-2 ${selectedOption === option
                                        ? option === current.correctAnswer
                                            ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        } ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                                    onClick={() => handleAnswerCheck(option)}
                                    disabled={isButtonDisabled}
                                    title={isButtonDisabled ? "You've already selected an answer" : ""}
                                >
                                    {option}
                                </button>
                            ))}
                            {(current?.type === 'STORYTELLING' || current?.type === 'CHALLENGE' || current?.type === 'UNITY') && (
                                <div>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        rows={4}
                                        placeholder="Enter your response here"
                                    ></textarea>
                                    <button
                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                                        onClick={handleStorytellingOrChallenge}
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between items-center text-lg mt-6 p-6 rounded-lg space-x-4" style={{ backgroundColor: curentSet.bgColor }}>
                            <p className="text-white">Score: {points?.score ?? 0}</p>
                            <GameSessionTimer style="w-12 h-12" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizComponent;
