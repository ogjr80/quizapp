'use client'; 

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trophy, Clock, Users, MessageCircle, Lightbulb, Zap, Star, XCircle, CheckCircle, Sun, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';

// Theme context
const ThemeContext = createContext();

// Header component
const Header = ({ darkMode }) => {
  return (
    <header className={`w-full py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <nav className="container mx-auto flex justify-between items-center">
        <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          IOCO Heritage Day
        </div>
        <ul className="flex space-x-6">
          <li>
            <a 
              href="https://www.devtitans.co.za/feature1" 
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Feature 1
            </a>
          </li>
          <li>
            <a 
              href="https://www.devtitans.co.za/heritage" 
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Heritage
            </a>
          </li>
          <li>
            <a 
              href="https://www.devtitans.co.za/quizapp" 
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quiz App
            </a>
          </li>
          <li>
            <a 
              href="https://www.devtitans.co.za/quizgame" 
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quiz Game
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const categories = [
  { name: 'Diversity Questions', icon: <Users className="w-8 h-8" />, colorLight: 'bg-blue-500', colorDark: 'bg-blue-900' },
  { name: 'Storytelling Prompts', icon: <MessageCircle className="w-8 h-8" />, colorLight: 'bg-green-500', colorDark: 'bg-green-900' },
  { name: 'Challenge Cards', icon: <Lightbulb className="w-8 h-8" />, colorLight: 'bg-yellow-500', colorDark: 'bg-yellow-900' },
  { name: 'Unity Cards', icon: <Zap className="w-8 h-8" />, colorLight: 'bg-purple-500', colorDark: 'bg-purple-900' },
];

const cards = [
  { 
    id: 'dq1', 
    category: 'Diversity Questions', 
    content: "Which South African ethnic group is known for the traditional dance called 'Indlamu'?", 
    options: ["Zulu", "Xhosa", "Sotho", "Tswana"],
    answer: "Zulu",
    explanation: "Indlamu is a traditional Zulu war dance performed at Zulu gatherings and ceremonies."
  },
  { 
    id: 'dq2', 
    category: 'Diversity Questions', 
    content: "Which of these is NOT one of South Africa's official languages?", 
    options: ["Afrikaans", "Swahili", "Xhosa", "Zulu"],
    answer: "Swahili",
    explanation: "South Africa has 11 official languages, but Swahili is not one of them. It's widely spoken in East Africa."
  },
  { 
    id: 'sp1', 
    category: 'Storytelling Prompts', 
    content: "Share a personal experience where you learned something valuable from someone of a different race." 
  },
  { 
    id: 'sp2', 
    category: 'Storytelling Prompts', 
    content: "Describe a cultural tradition from your heritage that you're proud of." 
  },
  { 
    id: 'cc1', 
    category: 'Challenge Cards', 
    content: "Find someone in the room who speaks a different language than you, and learn how to say 'Thank you' in 3 of the official languages" 
  },
  { 
    id: 'cc2', 
    category: 'Challenge Cards', 
    content: "Sing the first verse of the South African national anthem in a language other than your own" 
  },
  { 
    id: 'uc1', 
    category: 'Unity Cards', 
    content: "Lead a group discussion on the importance of racial diversity in the workplace and suggest one actionable way to improve it." 
  },
  { 
    id: 'uc2', 
    category: 'Unity Cards', 
    content: "Double the points on your next correct answer or completed challenge." 
  },
];

const CardDeck = ({ cards, onCardClick }) => {
  const { darkMode } = useContext(ThemeContext);
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
          <CardContent className={`p-4 h-full flex flex-col justify-between ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-white to-gray-100'}`}>
            <div className="text-lg font-bold mb-2">{card.category}</div>
            <div className="text-sm">{card.content.substring(0, 50)}...</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const QuestionCard = ({ card, onAnswer, timeLeft, answered }) => {
  const { darkMode } = useContext(ThemeContext);
  const progress = (timeLeft / 30) * 100; // Changed to 30 seconds

  const getCategoryColor = () => {
    const category = categories.find(c => c.name === card.category);
    return darkMode ? category.colorDark : category.colorLight;
  };

  return (
    <div className={`relative p-8 rounded-lg shadow-xl w-full h-full flex flex-col ${getCategoryColor()}`}>
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,10 Q30,5 50,10 T90,10 T130,10 T170,10 T210,10 T250,10 T290,10 T330,10 T370,10 T390,10 V590 Q370,595 350,590 T310,590 T270,590 T230,590 T190,590 T150,590 T110,590 T70,590 T30,590 T10,590 Z" 
              fill="none" 
              stroke={darkMode ? "white" : "black"} 
              strokeWidth="2"
              vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-3xl font-bold mb-6 text-white">{card.category}</h2>
        <p className="text-xl mb-8 text-white flex-grow">{card.content}</p>
        {card.options && (
          <div className="space-y-4 mb-8">
            {card.options.map((option, index) => (
              <button
                key={index}
                className={`w-full p-4 text-left rounded transition-colors duration-200 text-lg ${
                  answered
                    ? option === card.answer
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
                onClick={() => onAnswer(option)}
                disabled={answered}
              >
                {option}
                {answered && option === card.answer && <CheckCircle className="inline-block ml-2" />}
                {answered && option !== card.answer && <XCircle className="inline-block ml-2" />}
              </button>
            ))}
          </div>
        )}
        {answered && card.explanation && (
          <p className="mt-4 text-lg text-white">{card.explanation}</p>
        )}
        <div className="mt-auto">
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-linear" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-right text-xl font-bold text-white">
            Time left: {timeLeft}s
          </div>
        </div>
      </div>
    </div>
  );
};

const HeritageCardGame = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [shuffledCards, setShuffledCards] = useState(cards);
  const [score, setScore] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [gameTimeLeft, setGameTimeLeft] = useState(600); // 10 minutes
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30); // Changed to 30 seconds
  const [gameOver, setGameOver] = useState(false);
  const [unityCards, setUnityCards] = useState([]);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [totalAnswered, setTotalAnswered] = useState(0);

  useEffect(() => {
    shuffleCards();
    const gameTimer = setInterval(() => {
      setGameTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(gameTimer);
          setGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(gameTimer);
  }, []);

  useEffect(() => {
    let timer;
    if (isDialogOpen) {
      setQuestionTimeLeft(30); // Reset to 30 seconds
      setAnswered(false);
      timer = setInterval(() => {
        setQuestionTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isDialogOpen]);

  const shuffleCards = () => {
    setShuffledCards([...cards].sort(() => Math.random() - 0.5));
  };

  const handleCardClick = (card) => {
    setCurrentCard(card);
    setIsDialogOpen(true);
  };

  const handleCardAction = (action) => {
    setAnswered(true);
    let pointsEarned = 0;
    let correct = false;
    switch (currentCard.category) {
      case 'Diversity Questions':
        correct = action === currentCard.answer;
        pointsEarned = correct ? 10 : 0;
        break;
      case 'Storytelling Prompts':
      case 'Challenge Cards':
        pointsEarned = 15;
        correct = true;
        break;
      case 'Unity Cards':
        if (action === 'use') {
          setUnityCards([...unityCards, currentCard]);
        }
        break;
    }

    if (correct) {
      setStreak(streak + 1);
      if (streak + 1 >= 3) {
        pointsEarned *= 2;
        triggerConfetti();
      }
    } else {
      setStreak(0);
    }

    setScore(score + pointsEarned);
    setTotalAnswered(totalAnswered + 1);

    setTimeout(() => {
      setIsDialogOpen(false);
      setAnswered(false);
    }, 3000);
  };

  const handleTimeout = () => {
    setStreak(0);
    setIsDialogOpen(false);
    setAnswered(false);
    setTotalAnswered(totalAnswered + 1);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const restartGame = () => {
    setScore(0);
    setGameTimeLeft(600);
    setGameOver(false);
    setUnityCards([]);
    setStreak(0);
    setTotalAnswered(0);
    shuffleCards();
  };

  return (
    <ThemeContext.Provider value={{ darkMode }}>
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-orange-400 to-red-600'}`}>
        <Header darkMode={darkMode} />
        <div className="p-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
<h1 className="text-4xl font-bold text-white">Unity in Diversity: 1IOCO Heritage Day Game</h1>
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800">
                {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
              </button>
            </div>
            <div className="flex justify-between items-center mb-8">
              <button onClick={shuffleCards} className={`px-6 py-3 rounded-full transition-colors duration-300 font-bold ${darkMode ? 'bg-yellow-600 text-white hover:bg-yellow-500' : 'bg-yellow-400 text-black hover:bg-yellow-300'}`}>
                Shuffle Cards
              </button>
              <div className="text-2xl font-bold text-white flex items-center space-x-4">
                <div className="flex items-center">
                  <Trophy className="mr-2" /> {score}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2" /> {Math.floor(gameTimeLeft / 60)}:{(gameTimeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex items-center">
                  <Star className="mr-2" /> Streak: {streak}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map(category => (
                <div key={category.name} className={`${darkMode ? category.colorDark : category.colorLight} rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:scale-105`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto shadow-inner ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
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
        </div>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent className="max-w-4xl w-full max-h-[90vh] h-full bg-transparent">
            <AlertDialogHeader className="h-full">
              <AlertDialogDescription className="h-full">
                <QuestionCard
                  card={currentCard}
                  onAnswer={handleCardAction}
                  timeLeft={questionTimeLeft}
                  answered={answered}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={gameOver}>
          <AlertDialogContent className={darkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
            <AlertDialogHeader>
              <AlertDialogTitle>Game Over!</AlertDialogTitle>
              <AlertDialogDescription>
                <p>Your final score: {score}</p>
                <p>Total questions answered: {totalAnswered}</p>
                <p>Accuracy: {totalAnswered > 0 ? Math.round((score / (totalAnswered * 10)) * 100) : 0}%</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={restartGame} className={`${darkMode ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-yellow-400 hover:bg-yellow-300'} text-white`}>
                Play Again
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ThemeContext.Provider>
  );
};

export default HeritageCardGame;