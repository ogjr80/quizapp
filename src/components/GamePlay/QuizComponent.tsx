"use client";
import { useScores } from "@/hooks/stores/useScores";
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

    const handleAnswerCheck = (option: string) => {
        setSelectedOption(option);
        setShowAnswer(true);
        if (option === currentQuestion?.correctAnswer) {
            setScore(41);
        }

        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(() => {
            moveToNextQuestion();
        }, 300);
    };



    return (
        <div className="mx-auto h-screen p-10 my-5 lg:px-8">
            <div
                className="bg-cover bg-center rounded-lg h-full relative"
                style={{ backgroundImage: `url(${file.source.replace("-sm", "")})` }}
            >
                <button
                    className="absolute top-4 right-4 bg-red-600 p-2 rounded-full text-white text-3xl"
                    onClick={() => router.push(`/${url}`)}
                >
                    <FaTimes />
                </button>

                <div className="flex items-center justify-center h-full w-full">
                    <div className="relative rounded-lg shadow-lg max-w-md w-full">
                        <div
                            className="bg-cover bg-center rounded-t-lg p-6"
                            style={{ backgroundColor: file.bgColor }}
                        >
                            <h2 className="text-2xl font-bold text-center text-white mb-2">
                                {file.title} Questions
                            </h2>
                            <p className="text-center text-white">
                                {currentQuestion?.question ?? "Loading question..."}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-b-lg space-y-4">
                            {currentQuestion?.options.map((option, index) => (
                                <button
                                    key={index}
                                    className="w-full py-2 px-4 border-4 rounded-2xl hover:bg-green-300"
                                    style={{
                                        borderColor:
                                            selectedOption === option ? "green" : file.bgColor,
                                        backgroundColor:
                                            selectedOption === option ? "green" : "transparent",
                                        color: selectedOption === option ? "white" : "black",
                                    }}
                                    onClick={() => handleAnswerCheck(option)}
                                >
                                    {option}
                                </button>
                            )) || <p>No options available</p>}
                            <div className="hidden">
                                {showAnswer && (
                                    <p className="text-center mt-4">
                                        {selectedOption === currentQuestion?.correctAnswer
                                            ? "Correct!"
                                            : "Incorrect, try again."}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div
                            className="flex items-center justify-center text-lg mt-6 p-6 rounded-lg space-x-4"
                            style={{ backgroundColor: file.bgColor }}
                        >
                            <PiHourglassFill
                                className="h-10 w-10 rounded-full text-white border-4 border-white p-2"
                                style={{ backgroundColor: file.bgColor }}
                            />
                            <span
                                className="font-semibold text-base p-2 h-10 w-10 flex items-center justify-center rounded-full text-white border-4 border-white"
                                style={{ backgroundColor: file.bgColor }}
                            >
                                {timeLeft}s
                            </span>
                            <p className="text-white">{score}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
