'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSound from 'use-sound';
import { Question } from '@/types';
import { quizData } from '@/data/QuizData';


const Quiz: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [playBackgroundMusic, { stop: stopBackgroundMusic }] = useSound('/sounds/background-music.mp3', { loop: true });
  const [playCorrect] = useSound('/sounds/correct-answer.mp3');

  useEffect(() => {
    if (id) {
      playBackgroundMusic();
    }
    return () => stopBackgroundMusic();
  }, [id, playBackgroundMusic, stopBackgroundMusic]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
      playCorrect();
    }

    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      router.push('/');
    }
  };

  if (!id || !quizData[Number(id)]) return <div>Loading...</div>;

  const { questions } = quizData[Number(id)];
  const question: Question = questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Quiz {id}</h1>
      <div className="text-xl mb-4">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
      <div className="text-xl mb-6">Score: {score}/10</div>
      <h2 className="text-2xl mb-4">{question.text}</h2>
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option.isCorrect)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;