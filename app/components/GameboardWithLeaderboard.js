'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, XCircle, Eye, EyeOff, Star, Zap, User } from 'lucide-react';

const heritageQuestions = [
  {
    question: "On which date is Heritage Day celebrated in South Africa?",
    answer: "24 September",
    difficulty: "easy"
  },
  {
    question: "What was Heritage Day originally known as in KwaZulu-Natal?",
    answer: "Shaka Day",
    difficulty: "medium"
  },
  {
    question: "In what year was Heritage Day first celebrated as a public holiday in South Africa?",
    answer: "1995",
    difficulty: "hard"
  },
  {
    question: "What is the popular nickname for Heritage Day celebrations involving outdoor cooking?",
    answer: "Braai Day",
    difficulty: "easy"
  },
  {
    question: "Name one of the 11 official languages of South Africa.",
    answer: "Answers may include: Afrikaans, English, Ndebele, Northern Sotho, Sotho, Swazi, Tsonga, Tswana, Venda, Xhosa, or Zulu",
    difficulty: "medium"
  },
  // Add more questions here...
];

const GameBoard = () => {
  const [teamScores, setTeamScores] = useState([0, 0, 0, 0]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [bonusPoints, setBonusPoints] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  // Sound effects
  const startSound = new Audio('/api/placeholder/audio/start.mp3');
  const correctSound = new Audio('/api/placeholder/audio/correct.mp3');
  const incorrectSound = new Audio('/api/placeholder/audio/incorrect.mp3');
  const timerSound = new Audio('/api/placeholder/audio/timer.mp3');
  const gameOverSound = new Audio('/api/placeholder/audio/gameover.mp3');

  const playSound = useCallback((sound) => {
    sound.currentTime = 0;
    sound.play().catch(e => console.error("Error playing sound:", e));
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 5 && prevTimer > 1) {
            playSound(timerSound);
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      playSound(gameOverSound);
      handleAnswer(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, playSound, timerSound, gameOverSound]);

  useEffect(() => {
    updateLeaderboard();
  }, [teamScores]);

  const updateLeaderboard = () => {
    const newLeaderboard = teamScores.map((score, index) => ({
      team: `Team ${index + 1}`,
      score: score
    })).sort((a, b) => b.score - a.score);
    setLeaderboard(newLeaderboard);
  };

  const startTurn = () => {
    if (isTimerRunning) return;
    const newQuestion = getRandomQuestion();
    setTimer(30);
    setIsTimerRunning(true);
    setShowAnswer(false);
    setCurrentQuestion(newQuestion);
    setBonusPoints(calculateBonusPoints());
    playSound(startSound);
  };

  const getRandomQuestion = () => {
    const filteredQuestions = selectedDifficulty === 'all' 
      ? heritageQuestions 
      : heritageQuestions.filter(q => q.difficulty === selectedDifficulty);
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex];
  };

  const handleAnswer = (correct) => {
    setIsTimerRunning(false);
    if (correct) {
      setTeamScores(prevScores => {
        const newScores = [...prevScores];
        newScores[currentTeam] += 1 + bonusPoints;
        return newScores;
      });
      setStreak(prevStreak => prevStreak + 1);
      playSound(correctSound);
    } else {
      setStreak(0);
      playSound(incorrectSound);
    }
    nextTeam();
  };

  const nextTeam = () => {
    setCurrentTeam((currentTeam + 1) % teamScores.length);
    setShowAnswer(false);
    setCurrentQuestion(null);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const calculateBonusPoints = () => {
    let bonus = 0;
    if (streak >= 3) bonus += 1;
    if (currentQuestion?.difficulty === 'medium') bonus += 1;
    if (currentQuestion?.difficulty === 'hard') bonus += 2;
    return bonus;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-orange-400 to-red-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-5xl font-extrabold text-center mb-8 text-orange-600 tracking-wider">
          South African Heritage Day Quiz
        </h1>
        
        <div className="flex justify-between mb-8">
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Leaderboard</h2>
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 shadow-inner">
              {leaderboard.map((team, index) => (
                <div key={index} className={`flex items-center justify-between mb-2 p-2 rounded-lg ${index === 0 ? 'bg-yellow-300' : index === 1 ? 'bg-gray-300' : index === 2 ? 'bg-orange-300' : 'bg-white'}`}>
                  <div className="flex items-center">
                    <User size={24} className="mr-2 text-gray-700" />
                    <span className="font-semibold">{team.team}</span>
                  </div>
                  <span className="font-bold">{team.score}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2 pl-4">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Current Turn</h2>
            <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-4 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <User size={24} className="mr-2 text-blue-500" />
                  <span className="font-semibold text-lg">Team {currentTeam + 1}</span>
                </div>
                <div className="flex items-center">
                  <Star size={20} className="text-yellow-500 mr-1" />
                  <span className="font-bold mr-2">Streak: {streak}</span>
                  <Zap size={20} className="text-purple-500 mr-1" />
                  <span className="font-bold">Bonus: +{bonusPoints}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-center items-center space-x-4">
          <label className="text-lg font-semibold">Difficulty:</label>
          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="p-2 rounded-md border-2 border-orange-300 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-8 min-h-[200px] shadow-inner relative">
          {currentQuestion ? (
            <>
              <h2 className="text-2xl font-bold mb-4 text-orange-600">Question:</h2>
              <p className="text-xl mb-4">{currentQuestion.question}</p>
              {showAnswer && (
                <div className="mt-6 bg-green-100 p-4 rounded-xl">
                  <h3 className="text-xl font-bold text-green-700 mb-2">Answer:</h3>
                  <p className="text-lg text-green-800">{currentQuestion.answer}</p>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {currentQuestion.difficulty}
              </div>
            </>
          ) : (
            <p className="text-2xl text-center text-orange-500 font-bold">Click "Start Turn" to begin!</p>
          )}
        </div>

        <div className="flex justify-center items-center space-x-6 mb-8">
          <button
            onClick={startTurn}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xl font-bold px-6 py-3 rounded-full shadow-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={isTimerRunning}
          >
            <Clock size={24} className="mr-2" />
            Start Turn (Team {currentTeam + 1})
          </button>
          <div className="relative">
            <svg className="w-20 h-20">
              <circle
                className="text-gray-300"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
              />
              <circle
                className="text-blue-600"
                strokeWidth="5"
                strokeDasharray={30 * 6.2}
                strokeDashoffset={((30 - timer) / 30) * 30 * 6.2}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
              />
            </svg>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
              {timer}s
            </span>
          </div>
        </div>

        {currentQuestion && (
          <div className="flex justify-center space-x-6 mb-8">
            <button
              onClick={toggleAnswer}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xl font-bold px-6 py-3 rounded-full shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 flex items-center"
            >
              {showAnswer ? <EyeOff size={24} className="mr-2" /> : <Eye size={24} className="mr-2" />}
              {showAnswer ? "Hide Answer" : "Check Answer"}
            </button>
          </div>
        )}

        {currentQuestion && (
          <div className="flex justify-center space-x-6 mb-8">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xl font-bold px-6 py-3 rounded-full shadow-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 flex items-center"
            >
              <CheckCircle size={24} className="mr-2" /> Correct
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-gradient-to-r from-red-400 to-red-600 text-white text-xl font-bold px-6 py-3 rounded-full shadow-lg hover:from-red-500 hover:to-red-700 transition-all duration-300 flex items-center"
            >
              <XCircle size={24} className="mr-2" /> Incorrect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;