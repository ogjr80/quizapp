'use client'
import type { NextPage } from 'next';
import { Quiz } from '../types';
import {InteractiveCard} from '@/components/ICard';
import {AnimatedBackground} from "@opherlabs/components"
const quizzes: Quiz[] = [
  { id: 1, title: "History Quiz", description: "Test your history knowledge", bgColor: '', backImage: "/cards/south.webp" },
  { id: 2, title: "Science Quiz", description: "Explore scientific facts", bgColor: '', backImage: "/cards/center.webp" },
  { id: 3, title: "Literature Quiz", description: "Dive into literary worlds", bgColor: '', backImage: "/cards/east.webp" },
  { id: 4, title: "Geography Quiz", description: "Journey around the globe", bgColor: '', backImage: "/cards/west.webp" },
];

const Home: NextPage = () => {
  return (
    <div className="">
      <AnimatedBackground />
      <h1 className="text-4xl font-bold text-center mb-8">Unity In Diversity</h1>
      <div className="mx-auto max-w-7xl 2xl:max-w-screen-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quizzes.map((quiz) => (
          <InteractiveCard   isHolo navigateTo={`/quiz/${quiz.id}`}  key={quiz.id} {...quiz} >
            <div className="bg-green-600">
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>
            </div>
          </InteractiveCard>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Home;