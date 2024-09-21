'use client'
import React from 'react'
import { AnimatedBackground, CardsHolder, QuizCards, } from '@opherlabs/components'
import { QuizCardsData } from '@/data'
import Link from 'next/link'
import Image from 'next/image'
import { TrophyIcon } from 'lucide-react'
import { useEffect, useState } from 'react'; // Add this import
import { useSession } from 'next-auth/react'
import { usePoints } from '@/hooks/usePoints'

function PublicPage() {
  const [showTrophy, setShowTrophy] = useState(true); // Add state for toggling
  const { points, loading } = usePoints()
  useEffect(() => {
    const interval = setInterval(() => {
      setShowTrophy(prev => !prev); // Toggle the state
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  const { data: session } = useSession()

  // Sample leaderboard data
  const sampleLeaderboard = [
    { image: session?.user?.image ?? '', name: 'Player 1', points: 120 },
    { image: '/logo/opco.svg', name: 'Player 2', points: 95 },
    { image: '/logo/easyhq.svg', name: 'Player 3', points: 80 },
    { image: '/logo/eoh.svg', name: 'Player 4', points: 75 },
    { image: '/logo/opco.svg', name: 'Player 5', points: 60 },
  ];

  return (
    <div className='bg'>
      <AnimatedBackground />
      <div className="er z-10 fixed top-10 w-full">
        <div className="flex justify-between bg-white rounded-full px-16 py-2 items-center mx-auto max-w-7xl">
          <div className="text-start">
            <h1 className="text-4xl font-bold">Unity in Diversity</h1>
            <p>A cultural celebration Game</p>
          </div>
          <div className="flex justify-center items-center fixed left-50 left-1/2 transform -translate-x-1/2 rounded-full p-3 bg-white h-32 w-32">
            <h1 className='text-4xl font-bold border-2 border-black rounded-full h-full w-full flex justify-center items-center'>
              <Link href="/leaderboard">
                {showTrophy ? ( // Conditional rendering
                  <div className="relative">
                    <TrophyIcon className="w-16 h-16 text-gray-400" />
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-sm font-bold rounded-full px-1">
                      {points?.score ?? 0}
                    </span>
                  </div>
                ) : (
                  <Image src={session?.user?.image ?? '/ava.jpeg'} className='rounded-full' alt="Profile" width={80} height={80} /> // Add your profile image here
                )}
              </Link>
            </h1>
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
      <div className='min-h-screen  justify-center flex  items-center '>
        <div className=" flex justify-center gap-8 mx-auto max-w-7xl items-center">
          {QuizCardsData.map((file) => (
            <div
              key={file.id}
              className="relative group transition-transform w-full transform hover:scale-105"
            >
              <Link href={`/${'public'}/${file.id}`}>
                {/* Mobile View */}
                <div
                  className="block sm:hidden w-full h-48 bg-cover bg-center relative rounded-t-lg"
                  style={{ backgroundImage: `url(${file.source})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      {file.title.split(" ").map((word, index) => (
                        <p key={index} className="text-lg font-bold">
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
                  className="h-[16rem] hidden rounded-lg sm:flex items-center -mt-6 z-50 justify-center transition-transform duration-300 group-hover:translate-y-2 sm:bg-transparent"
                  style={{ backgroundColor: file.bgColor }}
                >
                  <div className="text-center sm:hidden">
                    {file.title.split(" ").map((word, index) => (
                      <p key={index} className="text-xl font-extrabold text-white">
                        {word}
                      </p>
                    ))}
                  </div>
                  <div className="hidden sm:block text-center">
                    {file.title.split(" ").map((word, index) => (
                      <p key={index} className="text-xl font-extrabold text-white">
                        {word}
                      </p>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Mini Leaderboard Carousel */}

      </div>
      <div className="leaderboard-container fixed bottom-0 p-3 left-1/2 transform -translate-x-1/2 overflow-hidden">
        <div className="leaderboard-carousel flex animate-slide">
          {sampleLeaderboard.map((player, index) => {
            const fireIntensity = player.points; // Use points to determine fire intensity
            return (
              <div key={index} className={`player-card flex text-center text-white bg-white/20 rounded-t-full pb-5 px-3 -mb-4 flex-col items-center mx-2 fire-effect-${fireIntensity}`}>
                <Image src={player.image} alt={player.name} width={50} height={50} className="rounded-full" />
                <p className='text-xl font-bold'>{player.points} points</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}



export default PublicPage