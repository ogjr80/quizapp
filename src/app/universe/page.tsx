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
import { useRouter } from 'next/navigation';
import { ShuffleQuestions } from '@/lib/shuffleQuestions'; // You'll need to create this utility function
import { useQuestions } from '@/hooks/stores/useQuestions'
import { Question } from '@/types/questions'
import useSessionCounter from '@/hooks/useSessionCounter'

function PublicPage() {
  const { setCurrent, current } = useQuestions()

  const { points, loading: pointsLoading } = usePoints() as any

  const { data: session } = useSession()

  const MyLeaderBoardData = [
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
      const qus = current ? file.questions.filter(r => r.type !== current?.type) : file.questions;
      let shuffled = ShuffleQuestions(qus as Question[]);

      // Ensure we have a valid shuffled array
      if (!shuffled || shuffled === undefined) {
        shuffled = ShuffleQuestions(file.questions as any)
      }

      setCurrent(shuffled);
      router.push(`/universe/${fileId}`);
    } else {
      console.error("File or questions not found");
    }
  };



  return (
    <div className='bg min-h-screen min-w-full max-w-screen max-h-screen overflow-hidden'>
      <AnimatedBackground />
      <div className="er hidden sm:block z-10 fixed top-10 w-full">
        <div className="flex justify-between bg-white rounded-full px-16 py-2 items-center mx-auto max-w-7xl">
          <div className="text-start">
            <h1 className="text-4xl font-bold">Unity in Diversity</h1>
            <p>A cultural celebration Game</p>
          </div>
          <div className="flex justify-center items-center fixed left-50 left-1/2 transform -translate-x-1/2 rounded-full p-3 bg-white h-32 w-32">
            <div className='text-4xl font-bold border-2 border-sblack rounded-full h-full w-full flex justify-center items-center'>
              {gameSession?.isActive ? (
                <GameSessionTimer />
              ) : (
                <button className={`hover:scale-105 cursor-pointer group duration-300 rounded-full hover:p-3 transition hover:bg-green-500 hover-text-white`} title={session?.user ? "Start Session" : "Please Login First"} disabled={!session?.user} onClick={handleSession}>
                  <IoPlayOutline className={`w-16 group h-16 text-gray-500 text-gray-400 ${session?.user ? '' : 'group-hover:hidden '}`} />
                  <Link href="/api/auth/signin" className={`text-sm hidden   text-white font-bold ${session?.user ? 'hidden' : 'group-hover:block'}`}>Login First</Link>
                </button>
              )}
            </div>
          </div>
          <div className="icons flex justify-end gap-4 items-center">
            <Link href="/">
              <Image src="/logo/eoh.svg" alt="LinkedIn" width={70} height={70} />
            </Link>
            <Link href="/">
              <Image src="/logo/opco.svg" alt="Twitter" width={60} height={60} />
            </Link>
            <Link href="/">
              <Image src="/logo/easyhq.svg" alt="Instagram" width={60} height={60} />
            </Link>
            <Link href={session?.user ? '/api/auth/signout' : '/api/auth/signin'}>
              {session?.user ? 'Logout' : 'Login'}
            </Link>
          </div>
        </div>
      </div>
      <div className="er sm:hidden z-10 fixed top-4 w-full">
        <div className="flex justify-between bg-white rounded-full px-4 py-2 items-center mx-auto max-w-7xl">
          <div className="">
            <h1 className='text-sm font-bold'>Unity in Diversity</h1>
            <p className='text-[10px]'>A Cultural Celebration Game</p>
          </div>
          <div className="flex justify-center items-center fixed left-50 left-1/2 transform -translate-x-1/2 rounded-full p-2 bg-white h-16 w-16">
            <div className='text-4xl font-bold border-2 border-sblack rounded-full h-full w-full flex justify-center items-center'>
              {gameSession?.isActive ? (
                <GameSessionTimer />
              ) : (
                <button className={`hover:scale-105 cursor-pointer group duration-300 rounded-full hover:p-3 transition hover:bg-green-500 hover-text-white`} title={session?.user ? "Start Session" : "Please Login First"} disabled={!session?.user} onClick={handleSession}>
                  <IoPlayOutline className={`w-8 group h-8 text-gray-500 text-gray-400 ${session?.user ? '' : 'group-hover:hidden '}`} />
                  <Link href="/api/auth/signin" className={`text-sm hidden   text-white font-bold ${session?.user ? 'hidden' : 'group-hover:block'}`}>Login First</Link>
                </button>
              )}
            </div>
          </div>
          <div className='flex justify-center items-center gap-4'>
            <Link href="/">
              <Image src="/logo/eoh.svg" alt="LinkedIn" width={40} height={30} />
            </Link>
            <Link href="/">
              <Image src="/logo/easyhq.svg" alt="Twitter" width={30} height={30} />
            </Link>
            <Link href="/">
              <Image src="/logo/opco.svg" alt="Twitter" width={30} height={30} />
            </Link>
          </div>
        </div>
      </div>
      <div className='min-h-screen max-h-screen max-w-full mx-auto  flex -mt-16 sm:-mt-0 items-center '>
        <div className=" grid grid-cols-2 sm:flex   gap-4 sm:gap-8 px-4 sm:px-0 mx-auto sm:max-w-7xl items-center">
          {QuizCardsData.map((file: any) => (
            <button
              title={(gameSession && !gameSession.isActive) ? 'Please start a new session' : "Click to play"}
              disabled={isLoading || (gameSession && !gameSession.isActive)}
              key={file.id}
              className={` relative group transition-transform w-full transform hover:scale-105`}
              onClick={() => handleCardClick(file.id)}
            >
              <div>
                <div className="sm:hidden overflow-hidden  rounded-t-lg bg-gray-100">
                  <Image
                    alt=""
                    src={file.source}
                    layout="fill"
                    objectFit="cover"
                    className="pointer-events-none transition-opacity duration-300 group-hover:greyscale"
                  />
                  <div
                    className="h-[16rem]  rounded-lg sm:flex items-center -mt-6 z-50 justify-center transition-transform duration-300 group-hover:translate-y-2 sm:bg-transparent"
                    style={{ backgroundColor: file.bgColor }}
                  >
                    <div className="text-center  flex flex-col  justify-center items-center min-h-[16rem] sm:hidden">
                      <div className='flex flex-col justify-center items-center'>
                        {file.title.split(" ").map((word: string) => (
                          <p key={word} className="text-xl px-3 font-extrabold text-white">
                            {word}
                          </p>
                        ))}
                        <span onClick={() => handleCardClick(file.id)} className='bg-white mx-3 px-5 mt-4 text-black px-3 py-1 rounded-full'>Play</span>
                      </div>
                    </div>
                    {points?.intraScores.find((one: any) => one.type === file.type)?.questions?.length === 10 && (
                      <div className="fixed bottom-0 left-0 bg-red-600 text-red-200 rounded-r-full px-3 py-1.5">
                        Complete
                      </div>
                    )}
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
                  className="h-[16rem] hidden rounded-lg sm:flex items-center -mt-6 z-50 justify-center transition-transform duration-300 group-hover:translate-y-2 sm:bg-transparent"
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
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
      <div className="leaderboard-container fixed max-w-7xl w-full sm:block bottom-0 pl-2 pr-9 sm:p-3 sm:left-1/2 transform sm:-translate-x-1/2 overflow-hidden">
        <div className="leaderboard-carousel flex justify-center animate-slide">
          {MyLeaderBoardData.map((player, index) => {
            const fireIntensity = player.intesity; // Use points to determine fire intensity
            return (
              <Link href={`/leaderboard`} key={index} className={`player-card flex text-center text-white bg-white/20 rounded-t-full pb-5 px-3 -mb-4 flex-col items-center mx-2 fire-effect-${fireIntensity}`}>
                <Image src={player.image} alt={player.name} width={50} height={50} className="rounded-full" />
                <p className='sm:text-xl text-sm font-bold'>{player.points} points</p>
              </Link>
            );
          })}
        </div>
      </div>

    </div >
  )
}

export default PublicPage