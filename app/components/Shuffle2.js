'use client'; 
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trophy } from 'lucide-react';

const categories = [
  { name: 'History', icon: '📜', color: 'bg-red-500' },
  { name: 'Culture', icon: '🎭', color: 'bg-blue-500' },
  { name: 'Geography', icon: '🗺️', color: 'bg-green-500' },
  { name: 'Famous People', icon: '👥', color: 'bg-yellow-500' },
];

const cards = categories.flatMap(category => 
  Array(5).fill().map((_, i) => ({
    id: `${category.name}-${i}`,
    category: category.name,
    question: `Question about ${category.name} ${i + 1}`,
    answer: `Answer to ${category.name} question ${i + 1}`,
  }))
);

const CardDeck = ({ cards, onCardClick }) => {
  return (
    <div className="relative w-64 h-96">
      {cards.map((card, index) => (
        <Card 
          key={card.id} 
          className="absolute w-full h-full shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:shadow-xl"
          style={{
            transform: `translateY(${index * 10}px) rotate(${Math.random() * 10 - 5}deg)`,
            zIndex: cards.length - index,
          }}
          onClick={() => onCardClick(card)}
        >
          <CardContent className="p-4 h-full flex flex-col justify-between">
            <div className="text-lg font-bold mb-2">{card.category}</div>
            <div className="text-sm">{card.question}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const HeritageCardGame = () => {
  const [shuffledCards, setShuffledCards] = useState(cards);
  const [score, setScore] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    setShuffledCards([...cards].sort(() => Math.random() - 0.5));
  };

  const handleCardClick = (card) => {
    setCurrentCard(card);
    setIsDialogOpen(true);
  };

  const handleAnswer = (correct) => {
    if (correct) {
      setScore(score + 1);
    }
    setIsDialogOpen(false);
    shuffleCards();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-white text-center">South African Heritage Day Card Game</h1>
        <div className="flex justify-between items-center mb-8">
          <button onClick={shuffleCards} className="px-6 py-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-300 transition-colors duration-300 font-bold">
            Shuffle Cards
          </button>
          <div className="text-2xl font-bold text-white flex items-center">
            <Trophy className="mr-2" /> Score: {score}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map(category => (
            <div key={category.name} className={`${category.color} rounded-lg p-6 shadow-lg`}>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">
                {category.icon}
              </div>
              <h2 className="text-2xl font-semibold mb-6 text-white text-center">{category.name}</h2>
              <CardDeck 
                cards={shuffledCards.filter(card => card.category === category.name)} 
                onCardClick={handleCardClick}
              />
            </div>
          ))}
        </div>
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{currentCard?.category}</AlertDialogTitle>
            <AlertDialogDescription>{currentCard?.question}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => handleAnswer(false)}>Incorrect</AlertDialogAction>
            <AlertDialogAction onClick={() => handleAnswer(true)}>Correct</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HeritageCardGame;