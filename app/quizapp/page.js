'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Clock, Loader2 } from 'lucide-react';

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('loading'); // 'loading', 'start', 'playing', 'end'

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
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('quizHighScore', score);
    }
  }, [score, highScore]);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('quizHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/quiz-questions.json');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
      setGameState('start');
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Handle error state here
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
    }
  };

  const renderGameContent = () => {
    switch (gameState) {
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
            <h2 className="text-3xl font-bold mb-4">Welcome to the EOH Values Quiz!</h2>
            <p className="mb-4">Test your knowledge of EOH Smart Solutions' core values with {questions.length} questions.</p>
            <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white">
              Start Quiz
            </Button>
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
          </motion.div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="bg-gray-800 text-white">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Sparkles className="mr-2" /> EOH Values Quiz
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

// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { motion, AnimatePresence } from 'framer-motion';
// import confetti from 'canvas-confetti';
// import { Sparkles, Trophy, Clock, Loader2 } from 'lucide-react';

// const QuizGame = () => {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showScore, setShowScore] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(15);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [streak, setStreak] = useState(0);
//   const [highScore, setHighScore] = useState(0);
//   const [gameState, setGameState] = useState('loading'); // 'loading', 'start', 'playing', 'end'

//   useEffect(() => {
//     fetchQuestions();
//   }, []);

//   useEffect(() => {
//     let timer;
//     if (gameState === 'playing' && timeLeft > 0) {
//       timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//     } else if (timeLeft === 0 && gameState === 'playing') {
//       handleNextQuestion();
//     }
//     return () => clearTimeout(timer);
//   }, [timeLeft, gameState]);

//   useEffect(() => {
//     if (score > highScore) {
//       setHighScore(score);
//       localStorage.setItem('quizHighScore', score);
//     }
//   }, [score, highScore]);

//   useEffect(() => {
//     const savedHighScore = localStorage.getItem('quizHighScore');
//     if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
//   }, []);

//   // const fetchQuestions = async () => {
//   //   try {
//   //     const response = await fetch('/quiz-questions.json');
//   //     if (!response.ok) {
//   //       throw new Error('Failed to fetch questions');
//   //     }
//   //     const data = await response.json();
//   //     setQuestions(data);
//   //     setGameState('start');
//   //   } catch (error) {
//   //     console.error('Error fetching questions:', error);
//   //     // Handle error state here
//   //   }
//   // };

//   const fetchQuestions = async () => {
//     try {
//       const response = await fetch('/quiz-questions.json');
//       if (!response.ok) {
//         throw new Error('Failed to fetch questions');
//       }
//       const data = await response.json();
//       setQuestions(data);
//       setGameState('start');
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//       // Handle error state here
//     }
//   };

//   const startGame = () => {
//     setGameState('playing');
//     setCurrentQuestion(0);
//     setScore(0);
//     setStreak(0);
//     setTimeLeft(15);
//     setShowScore(false);
//   };

//   const handleAnswerClick = (selectedAnswer) => {
//     setSelectedAnswer(selectedAnswer);
//     const correct = selectedAnswer === questions[currentQuestion].correctAnswer;
//     setIsCorrect(correct);
//     if (correct) {
//       setScore(score + 1);
//       setStreak(streak + 1);
//       if (streak === 2) {
//         confetti({
//           particleCount: 100,
//           spread: 70,
//           origin: { y: 0.6 }
//         });
//       }
//     } else {
//       setStreak(0);
//     }
//     setTimeout(() => {
//       handleNextQuestion();
//     }, 1000);
//   };

//   const handleNextQuestion = () => {
//     setSelectedAnswer(null);
//     setIsCorrect(null);
//     const nextQuestion = currentQuestion + 1;
//     if (nextQuestion < questions.length) {
//       setCurrentQuestion(nextQuestion);
//       setTimeLeft(15);
//     } else {
//       setGameState('end');
//       setShowScore(true);
//     }
//   };

//   const renderGameContent = () => {
//     switch (gameState) {
//       case 'loading':
//         return (
//           <div className="text-center">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//             <p>Loading questions...</p>
//           </div>
//         );
//       case 'start':
//         return (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="text-center"
//           >
//             <h2 className="text-3xl font-bold mb-4">Welcome to Quiz Master!</h2>
//             <p className="mb-4">Test your knowledge with {questions.length} challenging questions.</p>
//             <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white">
//               Start Quiz
//             </Button>
//           </motion.div>
//         );
//       case 'playing':
//         return (
//           <motion.div
//             key={currentQuestion}
//             initial={{ opacity: 0, x: -100 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: 100 }}
//           >
//             <div className="mb-4">
//               <p className="text-lg font-semibold mb-2">Question {currentQuestion + 1}/{questions.length}</p>
//               <p className="text-xl font-bold">{questions[currentQuestion].question}</p>
//             </div>
//             <div className="grid grid-cols-1 gap-3 mt-4">
//               {questions[currentQuestion].options.map((option, index) => (
//                 <Button
//                   key={index}
//                   onClick={() => handleAnswerClick(option)}
//                   variant={selectedAnswer === option ? (isCorrect ? "success" : "destructive") : "outline"}
//                   className={`text-left py-3 ${selectedAnswer && selectedAnswer !== option ? 'opacity-50' : ''}`}
//                   disabled={selectedAnswer !== null}
//                 >
//                   {option}
//                 </Button>
//               ))}
//             </div>
//             <div className="mt-6">
//               <p className="text-sm mb-2">Time left: {timeLeft} seconds</p>
//               <Progress value={(timeLeft / 15) * 100} className="h-2" />
//             </div>
//           </motion.div>
//         );
//       case 'end':
//         return (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="text-center"
//           >
//             <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
//             <p className="text-2xl mb-4">You scored {score} out of {questions.length}</p>
//             <p className="text-xl mb-4">High Score: {highScore}</p>
//             <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white">
//               Play Again
//             </Button>
//           </motion.div>
//         );
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
//       <Card className="w-full max-w-md mx-auto shadow-lg">
//         <CardHeader className="bg-gray-800 text-white">
//           <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
//             <Sparkles className="mr-2" /> Quiz Master
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           {renderGameContent()}
//         </CardContent>
//         <CardFooter className="justify-between bg-gray-100">
//           <div className="flex items-center">
//             <Trophy className="mr-2" />
//             <span>Score: {score}</span>
//           </div>
//           <div className="flex items-center">
//             <Clock className="mr-2" />
//             <span>High Score: {highScore}</span>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default QuizGame;
