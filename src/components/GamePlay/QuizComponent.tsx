"use client";
import { useScores } from "@/hooks/stores/useScores";
import { useGameSession } from "@/hooks/useGameSession";
import { usePoints } from "@/hooks/usePoints";
import { ScoreTypes } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { PiHourglassFill } from "react-icons/pi";

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
    files: FileItem[];
    url: string;
}

export const QuizComponent: React.FC<FileDetailProps> = ({ files, url, }) => {
    const { score, setScore } = useScores()
    const { session: gameSession } = useGameSession()
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const file = files.find((item) => item.id === id);
    const { submitQuizScore } = usePoints();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeLeft === 0) {
            moveToNextQuestion();
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timeLeft]);

    useEffect(() => {
        if (file && file.questions[currentQuestionIndex]) {
            setTimeLeft(file.questions[currentQuestionIndex].timer);
        }
    }, [currentQuestionIndex, file]);

    if (!file) return <p>File not found</p>;

    const currentQuestion = file.questions[currentQuestionIndex];

    const moveToNextQuestion = async () => {
        setShowAnswer(false);
        setSelectedOption(null);

        if (currentQuestionIndex < file.questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            // Check if the last question was answered correctly before submitting the score
            if (selectedOption === currentQuestion?.correctAnswer) {
                setScore(score ?? 0 + 1);
            }
            // save score to the database here
            const result = await submitQuizScore.mutateAsync({
                score: score as number, idtype: file.type
            });
            result.success && router.push(`/${url}`);
        }
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleAnswerCheck = async (option: string) => {
        setSelectedOption(option);
        setShowAnswer(true);
        if (option === currentQuestion?.correctAnswer) {
            setScore(score ?? 0 + 1);
            const result = await submitQuizScore.mutateAsync({
                score: 1, idtype: file.type
            });
            result.success && router.push(`/${url}`);
        }

        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(() => {
            // moveToNextQuestion();
        }, 300);
    };

    const handleStorytellingOrChallenge = () => {
        // For storytelling and challenge cards, we'll just move to the next question
        // In a real implementation, you might want to add a voting system or validation here
        setTimeout(() => {
            setCurrentQuestionIndex((prevIndex) => {
                if (prevIndex < file.questions.length - 1) {
                    return prevIndex + 1;
                } else {
                    // onNextTeam();
                    router.push('/public');
                    return prevIndex;
                }
            });
        }, 1000);
    };

    return (
        <div className="mx-auto h-screen p-10 my-5 lg:px-8">
            <div className="bg-cover bg-center rounded-lg h-full relative">
                <button
                    className="absolute top-4 right-4 bg-red-600 p-2 rounded-full text-white text-3xl"
                    onClick={() => router.push('/public')}
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
                        <div className="bg-cover bg-center rounded-t-lg p-6" style={{ backgroundColor: file.bgColor }}>
                            <h2 className="text-2xl font-bold text-center text-white mb-2">
                                {file.title}
                            </h2>
                            <p className="text-center text-white">
                                {currentQuestion.question}
                            </p>
                            <p className="text-center text-white mt-2">
                                Current Team:
                            </p>
                        </div>
                        <div className="bg-white rounded-b-lg p-6">
                            {file.type === 'DIVERSITY' && currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`w-full p-4 text-left rounded mb-2 ${showAnswer
                                        ? option === currentQuestion.correctAnswer
                                            ? "bg-green-500 text-white"
                                            : option === selectedOption
                                                ? "bg-red-500 text-white"
                                                : "bg-gray-200"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    onClick={() => handleAnswerCheck(option)}
                                    disabled={showAnswer}
                                >
                                    {option}
                                </button>
                            ))}
                            {(file.type === 'STORYTELLING' || file.type === 'CHALLENGE' || file.type === 'UNITY') && (
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
                        <div className="flex items-center justify-center text-lg mt-6 p-6 rounded-lg space-x-4" style={{ backgroundColor: file.bgColor }}>
                            <p className="text-white">Score: {score}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
