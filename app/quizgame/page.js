'use client'; 
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Clock, Loader2, UserPlus, LogIn } from 'lucide-react';

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('auth'); // 'auth', 'loading', 'start', 'playing', 'end'
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  useEffect(() => {
    if (user) {
      fetchGameHistory();
    }
  }, [user]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/itthynk-values-quiz.json');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchGameHistory = async () => {
    try {
      const response = await fetch('/api/game/get-history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const history = await response.json();
        setGameHistory(history);
        const maxScore = Math.max(...history.map(game => game.score), 0);
        setHighScore(maxScore);
      }
    } catch (error) {
      console.error('Error fetching game history:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === 'signin' ? '/api/auth/signin' : '/api/auth/signup';
    const body = authMode === 'signin' ? { email, password } : { email, password, name };
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setUser(data.userId);
        setGameState('start');
      } else {
        // Handle error
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
  };

  const handleAnswerClick = (selectedAnswer) => {
    setSelectedAnswer(selectedAnswer);
    const correct = selectedAnswer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      if (streak === 2) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(15);
    } else {
      setGameState('end');
      saveGameHistory();
    }
  };

  const saveGameHistory = async () => {
    try {
      await fetch('/api/game/save-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ score, totalQuestions: questions.length })
      });
      fetchGameHistory();
    } catch (error) {
      console.error('Error saving game history:', error);
    }
  };

  const renderAuthForm = () => (
    <form onSubmit={handleAuth} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {authMode === 'signup' && (
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <Button type="submit" className="w-full">
        {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
      </Button>
      <p className="text-center">
        {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          className="text-blue-500 hover:underline"
        >
          {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </form>
  );

  const renderGameContent = () => {
    switch (gameState) {
      case 'auth':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </h2>
            {renderAuthForm()}
          </div>
        );
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading questions...</p>
          </div>
        );
      case 'start':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Welcome to the ITTHYNK Values Quiz!</h2>
            <p className="mb-4">Test your knowledge of ITTHYNK Smart Solutions' core values with {questions.length} questions.</p>
            <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white">
              Start Quiz
            </Button>
            {gameHistory.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">Your Game History</h3>
                <ul className="space-y-2">
                  {gameHistory.slice(0, 5).map((game, index) => (
                    <li key={index} className="text-sm">
                      Score: {game.score}/{game.totalQuestions} - {new Date(game.createdAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        );
      case 'playing':
        return (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">Question {currentQuestion + 1}/{questions.length}</p>
              <p className="text-xl font-bold">{questions[currentQuestion].question}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-4">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  variant={selectedAnswer === option ? (isCorrect ? "success" : "destructive") : "outline"}
                  className={`text-left py-3 ${selectedAnswer && selectedAnswer !== option ? 'opacity-50' : ''}`}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-sm mb-2">Time left: {timeLeft} seconds</p>
              <Progress value={(timeLeft / 15) * 100} className="h-2" />
            </div>
          </motion.div>
        );
      case 'end':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-2xl mb-4">You scored {score} out of {questions.length}</p>
            <p className="text-xl mb-4">High Score: {highScore}</p>
            <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white">
              Play Again
            </Button>
            <Button onClick={() => setGameState('start')} className="bg-blue-500 hover:bg-blue-600 text-white ml-4">
              Back to Menu
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="bg-gray-800 text-white">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Sparkles className="mr-2" /> ITTHYNK Values Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {renderGameContent()}
        </CardContent>
        <CardFooter className="justify-between bg-gray-100">
          <div className="flex items-center">
            <Trophy className="mr-2" />
            <span>Score: {score}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2" />
            <span>High Score: {highScore}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizGame;