'use client';

import React, { useState, useEffect } from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import { Clock, Users, Rocket, Check } from 'lucide-react';
import { RegisterAction } from './RegisterAction';
import { Session } from 'inspector/promises';
export const CountdownComponent: React.FC<{ targetDate: string, url: string, session?: Session | unknown }> = ({ targetDate, url = '/api/auth/signup', session }) => {
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});
  const [isClient, setIsClient] = useState(false);

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    setIsClient(true);
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isClient]);

  const timeComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <div key={interval} className="flex px-3 flex-col items-center p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-md">
        <span className="text-3xl font-bold text-white mb-2 sm:text-2xl 2xl:text-5xl">{timeLeft[interval]}</span>
        <span className="text-sm text-white uppercase sm:text-base 2xl:text-lg">{interval}</span>
      </div>
    );
  });

  return (
    <div className="relative px-4 min-h-screen w-full flex flex-col items-center justify-center bg bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white overflow-hidden">
      <AnimatedBackground />
      <div className="z-10 text-center px-4 mx-3 text-white mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:text-3xl pt-4 sm:pt-0  2xl:text-5xl">Unity in Diversity: A Cultural Celebration Game</h1>
        <p className="text-xl mb-4 sm:text-lg">Countdown to Heritage Day Celebration</p>
        <div className="flex space-x-4 justify-center sm:space-x-2">
          {isClient ? (timeComponents.length ? timeComponents : <span className="text-xl sm:text-2xl 2xl:text-5xl">The Game has started!</span>) : <span className="text-4xl sm:text-2xl 2xl:text-5xl">Loading...</span>}
        </div>
      </div>
      <div className="z-10 mt-3 text-white text-center">
        <p className="text-lg sm:text-base">Register by 23 September 2024 to secure your spot!</p>
        <div className="hidden py-3 space-x-4 my-4 flex justify-center items-center">
          <RegisterAction url={url} />
          <RegisterAction mode="session" url={url} session={session} />
        </div>
      </div>
      <div className="z-10 bg-white  backdrop-blur-md p-6 rounded-lg backdrop-blur-md max-w-2xl sm:max-w-2xl sm:p-4">
        <h2 className="text-2xl font-bold mb-4 sm:text-xl">How to Play the Game</h2>
        <ul className="space-y-4 sm:space-y-2">
          <li className="flex items-start">
            <Check className="mr-2 flex-shrink-0" />
            <span>Choose your difficulty level: Easy, Medium, or Hard.</span>
          </li>
          <li className="flex items-start">
            <Check className="mr-2 flex-shrink-0" />
            <span>Answer questions about South African culture, history, and iOCO.</span>
          </li>
          <li className="flex items-start">
            <Check className="mr-2 flex-shrink-0" />
            <span>Use Unity Cards to boost your score and collaborate with others.</span>
          </li>

          <li className="flex items-start">
            <Check className="mr-2 flex-shrink-0" />
            <span>Race against the 10-minute timer to earn as many points as possible.</span>
          </li>
        </ul>
      </div>


    </div>
  );
};
