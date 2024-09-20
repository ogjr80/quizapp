import type { NextPage } from 'next';
import { Quiz } from '../types';
import {InteractiveCard} from '@/components/ICard';

const quizzes: Quiz[] = [
  { id: 1, title: "History Quiz", description: "Test your history knowledge", backImage: "/cards/south.webp" },
  { id: 2, title: "Science Quiz", description: "Explore scientific facts", backImage: "/cards/center.webp" },
  { id: 3, title: "Literature Quiz", description: "Dive into literary worlds", backImage: "/cards/east.webp" },
  { id: 4, title: "Geography Quiz", description: "Journey around the globe", backImage: "/cards/west.webp" },
];

const Home: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Quiz Card Game</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quizzes.map((quiz) => (
          <InteractiveCard  isHolo navigateTo={`/quiz/${quiz.id}`}  key={quiz.id} {...quiz} >
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );
};

export default Home;