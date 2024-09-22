'use client'
import type { NextPage } from 'next';
import { Quiz } from '@/types';
import { InteractiveCard } from '@/components/ICard';
import { AnimatedBackground } from "@/components"
import { PiUserCircleDuotone } from 'react-icons/pi';
const quizzes: Quiz[] = [
  { id: 1, title: "Diversity Questins", description: "Take diversity quiz to earn points", bgColor: 'bg-[#1A3E75]', backImage: "/cards/south.webp" },
  { id: 2, title: "Storytelling Prompts", description: "Tell a story to the audience", bgColor: 'bg-[#B32891]', backImage: "/cards/center.webp" },
  { id: 3, title: "Challenging Cards", description: "Dive into literary worlds", bgColor: 'bg-[#00C8DA]', backImage: "/cards/east.webp" },
  { id: 4, title: "Unity Cards", description: "Journey around the country", bgColor: 'bg-[#00BEA1]', backImage: "/cards/west.webp" },
];

export const GamePlay: NextPage = () => {
  return (
    <div className="bg min-h-screen flex flex-col justify-center items-center">
      <AnimatedBackground />
      <h1 className="text-4xl text-white font-bold text-center mb-8">Unity in Diversity: A Cultural Celebration Game
      </h1>
      <div className="grid grid-cols-3 justify-start items-center mx-auto max-w-7xl">
        <div className="shuffle  mx-auto max-w-7x">
          <button>Scores</button>
          <button>Shuffle Questions</button>
        </div>
        <div className="icons flex space-x-3 ">
          {
            [1, 23, 4].map(e => (<PiUserCircleDuotone key={e} className='h-4 w-4' />))
          }
        </div>
        <div className="companies flex ">
          {
            [1, 23, 4].map(e => (<PiUserCircleDuotone key={e} className='h-4 w-4' />))
          }
        </div>
      </div>
      <div className="mx-auto max-w-7xl 2xl:max-w-screen-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quizzes.map((quiz) => (
            <InteractiveCard isHolo navigateTo={`/quiz/${quiz.id}`} key={quiz.id} {...quiz} >
              <div className={`justify-center items-center p-3 text-white ${quiz.bgColor}`}>
                <h1 className='text-2xl'>{quiz.title}</h1>
                <p>{quiz.description}</p>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </div>
    </div>
  );
};
