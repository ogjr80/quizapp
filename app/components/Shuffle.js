'use client'; 

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Mock data for categories and cards
const categories = [
  { name: 'History', icon: '📜' },
  { name: 'Culture', icon: '🎭' },
  { name: 'Geography', icon: '🗺️' },
  { name: 'Famous People', icon: '👥' },
];

const cards = categories.flatMap(category => 
  Array(5).fill().map((_, i) => ({
    id: `${category.name}-${i}`,
    category: category.name,
    question: `Question about ${category.name} ${i + 1}`,
    answer: `Answer to ${category.name} question ${i + 1}`,
  }))
);

const CardDeck = ({ cards }) => {
  return (
    <div className="relative w-64 h-96">
      {cards.map((card, index) => (
        <Card key={card.id} className="absolute w-full h-full shadow-md transition-all duration-300 ease-in-out" style={{
          transform: `translateY(${index * 10}px)`,
          zIndex: cards.length - index,
        }}>
          <CardContent className="p-4">
            <div className="text-lg font-bold mb-2">{card.category}</div>
            <div>{card.question}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const HeritageCardGame = () => {
  const [shuffledCards, setShuffledCards] = useState(cards);

  const shuffleCards = () => {
    setShuffledCards([...cards].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">South African Heritage Day Card Game</h1>
      <button onClick={shuffleCards} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Shuffle Cards
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map(category => (
          <div key={category.name} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl mb-2">
              {category.icon}
            </div>
            <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
            <CardDeck cards={shuffledCards.filter(card => card.category === category.name)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeritageCardGame;
