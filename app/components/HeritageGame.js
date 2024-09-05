'use client'; 
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trophy, Clock, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

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
    difficulty: Math.floor(Math.random() * 3) + 1, // 1: Easy, 2: Medium, 3: Hard

  }))
);

const CardDeck = ({ cards, onCardClick }) => {
  return (
    <div className="relative w-64 h-96">
      {cards.map((card, index) => (
        <Card 
          key={card.id} 
          className="absolute w-full h-full shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:shadow-xl transform hover:-translate-y-2"
          style={{
            transform: `translateY(${index * 10}px) rotate(${Math.random() * 10 - 5}deg)`,
            zIndex: cards.length - index,
          }}
          onClick={() => onCardClick(card)}
        >
          <CardContent className="p-4 h-full flex flex-col justify-between bg-gradient-to-br from-white to-gray-100">
            <div className="text-lg font-bold mb-2">{card.category}</div>
            <div className="text-sm">{card.question}</div>
            <div className="mt-2 flex justify-end">
              {[...Array(card.difficulty)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-500 fill-current" />
              ))}
            </div>
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
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    shuffleCards();
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
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
      const points = currentCard.difficulty * 10;
      setScore(score + points);
      setStreak(streak + 1);
      if (streak + 1 >= 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      setStreak(0);
    }
    setIsDialogOpen(false);
    shuffleCards();
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setStreak(0);
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
          <div className="text-2xl font-bold text-white flex items-center space-x-4">
            <div className="flex items-center">
              <Trophy className="mr-2" /> {score}
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" /> {timeLeft}s
            </div>
            <div className="flex items-center">
              <Star className="mr-2 fill-current" /> {streak}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map(category => (
            <div key={category.name} className={`${category.color} rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:scale-105`}>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mb-4 mx-auto shadow-inner">
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
      <AlertDialog open={gameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Game Over!</AlertDialogTitle>
            <AlertDialogDescription>Your final score: {score}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={restartGame}>Play Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HeritageCardGame;