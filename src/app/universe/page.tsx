'use client'
import React from 'react'
import { AnimatedBackground } from '@/components'
import { QuizCardsData } from '@/data'
import Link from 'next/link'
import Image from 'next/image'
import { IoPlayOutline } from "react-icons/io5";

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePoints } from '@/hooks/usePoints'
import { useGameSession } from '@/hooks/useGameSession'
import { GameSessionTimer } from "@/components"
import { usePathname, useRouter } from 'next/navigation';
import { isFull, ShuffleQuestions } from '@/lib/shuffleQuestions'; // You'll need to create this utility function
import { useQuestions } from '@/hooks/stores/useQuestions'
import { Question } from '@/types/questions'
import useSessionCounter from '@/hooks/useSessionCounter'

function PublicPage() {
  const { setCurrent, current } = useQuestions()

  const [showTrophy, setShowTrophy] = useState(true); // Add state for toggling
  const { points, loading: pointsLoading } = usePoints() as any
  useEffect(() => {
    const interval = setInterval(() => {
      setShowTrophy(prev => !prev); // Toggle the state
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  const { data: session } = useSession()

  // Sample leaderboard data
  const sampleLeaderboard = [
    { image: session?.user?.image ?? '/ava.jpeg', name: 'Player 1', points: points?.score ?? 0, intesity: 150 },
    { image: '/cards/blue-sm.svg', name: 'Player 5', points: points?.intraScores.find((e: any) => e.type === "DIVERSITY")?.score ?? 0, intesity: 120 },
    { image: '/cards/country-sm.svg', name: 'Player 4', points: points?.intraScores.find((e: any) => e.type === "STORYTELLING")?.score ?? 0, intesity: 90 },
    { image: '/cards/sun-sm.svg', name: 'Player 2', points: points?.intraScores.find((e: any) => e.type === "CHALLENGE")?.score ?? 0, intesity: 60 },
    { image: '/cards/green-sm.svg', name: 'Player 3', points: points?.intraScores.find((e: any) => e.type === "UNITY")?.score ?? 0, intesity: 30 },
  ];
  const { session: gameSession, startGameSession } = useGameSession() as any
  const handleSession = async () => {
    try {
      await startGameSession.mutateAsync({ type: "individual" })
    } catch (error) {
      console.log(error)
    }
  }
  const { isTimeUp } = useSessionCounter()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Add this line

  useEffect(() => {
    // Set loading to false once all necessary data is loaded
    if (!pointsLoading && gameSession !== undefined) {
      setIsLoading(false);
    }
  }, [pointsLoading, gameSession]);

  const handleCardClick = (fileId: string) => {
    const file = QuizCardsData.find(f => f.id === fileId);
    if (file && file.questions) {
      const qus = current ? file.questions.filter(r => r.type !== current?.type) : file.questions
      const shfled = ShuffleQuestions(qus as Question[]);
      setCurrent(shfled)
      router.push(`/universe/${fileId}`);
    }
  };



  return (
    <div className='bg'>
      <AnimatedBackground />
      <div className="er z-10 fixed top-10 w-full">
        <div className="flex flex-col sm:flex-row justify-between bg-white rounded-full px-4 sm:px-16 py-2 items-center mx-auto max-w-7xl">
          <div className="text-center sm:text-start">
            <h1 className="text-2xl sm:text-4xl font-bold">Unity in Diversity</h1>
            <p className="text-sm sm:text-base">A cultural celebration Game</p>
          </div>
          <div className="flex justify-center items-center fixed sm:static left-50 left-1/2 transform -translate-x-1/2 sm:transform-none rounded-full p-3 bg-white h-24 sm:h-32 w-24 sm:w-32">
            <div className='text-2xl sm:text-4xl font-bold border-2 border-sblack rounded-full h-full w-full flex justify-center items-center'>
              {gameSession ? (
                <GameSessionTimer />
              ) : (
                <button className={`hover:scale-105 cursor-pointer group duration-300 rounded-full hover:p-3 transition hover:bg-green-500 hover-text-white`} title={session?.user ? "Start Session" : "Please Login First"} disabled={!session?.user} onClick={handleSession}>
                  <IoPlayOutline className="w-8 sm:w-16 h-8 sm:h-16 group-hover:text-white text-gray-400" />
                </button>
              )}
            </div>
          </div>
          <div className="icons flex justify-center sm:justify-end gap-2 sm:gap-4 items-center">
            <Link href="/">
              <Image src="/logo/eoh.svg" alt="LinkedIn" width={50} height={50} />
            </Link>
            <Link href="/">
              <Image src="/logo/opco.svg" alt="Twitter" width={40} height={40} />
            </Link>
            <Link href="/">
              <Image src="/logo/easyhq.svg" alt="Instagram" width={40} height={40} />
            </Link>
            <Link href={session?.user ? '/api/auth/signout' : '/api/auth/signin'}>
              {session?.user ? 'Logout' : 'Login'}
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white z-[60]">

      </div>
      <div className='min-h-screen flex flex-col justify-center items-center'>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mx-auto max-w-7xl items-center">
          {QuizCardsData.map((file: any) => (
            <button
              title={isLoading || (points?.intraScores.find((e: any) => e.type === file.type)?.questions?.length || 0) >= 10 ? "You have taken all 10 questions" : isTimeUp ? "Time Up" : (gameSession && !gameSession.isActive) ? 'Please start a new session' : "Click to play"}
              disabled={isLoading || (points?.intraScores.find((e: any) => e.type === file.type)?.questions?.length || 0) >= 10 || isTimeUp || (gameSession && !gameSession.isActive)}
              key={file.id}
              className={`${(points?.intraScores.find((e: any) => e.type === file.type)?.questions?.length || 0) >= 10 ? 'border-l-red-500 border-l-4 rounded-l-md' : ''} relative group transition-transform w-full sm:w-auto transform hover:scale-105`}
              onClick={() => handleCardClick(file.id)}
            >
              <div>

                {/* Mobile View */}
                <div
                  className="block sm:hidden w-full h-48 bg-cover bg-center relative rounded-t-lg"
                  style={{ backgroundImage: `url(${file.source})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      {file.title.split(" ").map((word: string) => (
                        <p key={word} className="text-lg font-bold">
                          {word}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Desktop View */}
                <div
                  className="hidden sm:block sm:aspect-h-7 sm:aspect-w-24 w-full overflow-hidden rounded-t-lg bg-gray-100 relative"
                  style={{ height: "200px", width: "300px" }}
                >
                  <Image
                    alt=""
                    src={file.source}
                    layout="fill"
                    objectFit="cover"
                    className="pointer-events-none transition-opacity duration-300 group-hover:greyscale"
                  />
                </div>

                <div
                  className="h-[16rem] hidden sm:flex items-center -mt-6 z-50 justify-center transition-transform duration-300 group-hover:translate-y-2 sm:bg-transparent"
                  style={{ backgroundColor: file.bgColor }}
                >
                  <div className="text-center sm:hidden">
                    {file.title.split(" ").map((word: string) => (
                      <p key={word} className="text-xl font-extrabold text-white">
                        {word}
                      </p>
                    ))}
                  </div>
                  <div className="hidden sm:block text-center">
                    {file.title.split(" ").map((word: string) => (
                      <p key={word} className="text-xl font-extrabold text-white">
                        {word}
                      </p>
                    ))}
                  </div>
                  {points?.intraScores.find((one: any) => one.type === file.type)?.questions?.length === 10 && (
                    <div className="fixed bottom-0 left-0 bg-red-600 text-red-200 rounded-r-full px-3 py-1.5">
                      Complete
                    </div>
                  )}
                </div>


              </div>
            </button>
          ))}
        </div>

        {/* Mini Leaderboard Carousel */}

      </div>
      <div className="leaderboard-container fixed bottom-0 p-3 left-1/2 transform -translate-x-1/2 overflow-hidden">
        <div className="leaderboard-carousel flex animate-slide">
          {sampleLeaderboard.map((player, index) => {
            const fireIntensity = player.intesity; // Use points to determine fire intensity
            return (
              <div key={index} className={`player-card flex text-center text-white bg-white/20 rounded-t-full pb-5 px-3 -mb-4 flex-col items-center mx-2 fire-effect-${fireIntensity}`}>
                <Image src={player.image} alt={player.name} width={50} height={50} className="rounded-full" />
                <p className='text-xl font-bold'>{player.points} points</p>
              </div>
            );
          })}
        </div>
      </div>
    </div >
  )
}

export default PublicPage