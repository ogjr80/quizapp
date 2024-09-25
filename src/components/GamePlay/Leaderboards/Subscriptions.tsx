'use client'
import React, { useEffect, useState } from 'react';
import { Points } from '@prisma/client';
import { AnimatedBackground } from '@/components/CountDown';
import { sortLeaderboard } from '@/lib/sortLeaderboard';
import Image from 'next/image';
import { PiEmptyFill } from 'react-icons/pi';
import { StepBackIcon } from 'lucide-react';
import Link from 'next/link';
import { Users } from 'lucide-react';

export const PointsSubscriber: React.FC = () => {
    const [data, setData] = useState<any | null>(null);
    const [sortedData, setSortedData] = useState<{
        sortedByOverallScore: Points[];
        sortedByIntraScores: Points[];
        groupedAndSortedIntraScores: any
    }>({ sortedByOverallScore: [], sortedByIntraScores: [], groupedAndSortedIntraScores: {} });

    useEffect(() => {
        const eventSource = new EventSource('/api/sse');
        eventSource.onmessage = (event) => {
            const newData = JSON.parse(event.data) as any;
            setData(newData);
            setSortedData(sortLeaderboard(newData['points'] as any) as any);
        };

        eventSource.onerror = (error) => {
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);
    const colors = {
        STORYTELLING: "bg-[#00BEA1]/70",
        DIVERSITY: "bg-[#1A3E75]/70",
        UNITY: "bg-[#00C8DA]/70",
        CHALLENGE: "bg-[#00BEA1]/70",
    }
    const [showPlayers, setShowPlayers] = useState(false);
    return (
        <>
            {data ?
                <div className='bg'>
                    <AnimatedBackground />
                    <div className={`fixed z-[80] px-3 right-0 left-0 bottom-0 bg-green-500/90 overflow-y-auto transition-transform duration-300 ease-in-out ${showPlayers ? 'translate-y-0' : 'translate-y-full'} md:hidden`}>
                        <h2 className="text-center font-bold text-2xl font-mono text-white py-2">
                            <span>Playing Now</span>
                        </h2>
                        <ul className="space-y-2 px-1 max-h-[70vh] overflow-y-auto">
                            {data['players'].map((player: any) => (
                                <li className='flex items-center bg-white/70 rounded-full my-5 gap-2' key={player.id}>
                                    <Image className='rounded-full' src={player?.image ?? '/ava.jpeg'} alt={player.name} width={32} height={32} />
                                    <span className='text-white text-sm font-bold'>{player.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        onClick={() => setShowPlayers(!showPlayers)}
                        className="fixed z-[90] bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg md:hidden flex items-center"
                    >
                        <Users size={24} />
                        {data && data['players'] && (
                            <span className="ml-1 bg-white text-green-500 rounded-full px-2 py-1 text-xs font-bold">
                                {data['players'].length}
                            </span>
                        )}
                    </button>
                    <div className="hidden md:block fixed z-[80] divide-y px-3 right-0 top-0 bottom-0 w-1/8 bg-green-500/90 overflow-y-auto">
                        <h2 className="text-center font-bold text-2xl font-mono font-bold text-white py-2">
                            <span> Playing Now</span>
                        </h2>
                        <ul className="space-y-2 px-1">
                            {
                                data && data['players'].map((player: any) => (
                                    <li className='flex items-center bg-white/70 rounded-full my-5 gap-2' key={player.id}><Image className='rounded-full' src={player?.image ?? '/ava.jpeg'} alt={player.name} width={32} height={32} /><span className='text-swhite text-sm font-bold'>{player.name}</span></li>
                                ))
                            }

                        </ul>
                    </div>
                    <div className="bg-whote font-mono  rounded-3xl min-h-scheen h-screen sm:p-16 pt-16  px-4 flex justify-center items-center">
                        <div className="rounded-3xl min-w-7xl overflow-y-auto overflow-x-hidden mx-auto w-screen h-[44rem] z-[60] bg-white/90 max-w-7xl relative">

                            <div className="pr-1/6 divide-y divide-gray-300 py-6 pl-5">
                                <h1 className="sm:text-6xl text-xl flex gap-3  items-center font-bold">
                                    <Link href="/universe">
                                        <StepBackIcon className='sm:w-10 sm:h-10 w-6 h-6 text-green-500 animate-pulse' />
                                    </Link>
                                    <span>Game play Leaderboard</span></h1>
                                <div className="grid sm:divide-x divide-gray-300 sm:grid-cols-3">
                                    <div className="mt-8 sm:mx-5 ">
                                        <h2 className='sm:text-4xl text-md font-bold'>Main Leaderboard</h2>

                                        {
                                            sortedData.sortedByOverallScore.map((player: any, index: number) => (
                                                <div key={player.id} className="index sm:text-xl text-md m-0 flex items-center  w-full">
                                                    <span className='sm:text-xl text-md font-bold'>{index + 1}</span>
                                                    <div className='flex justify-between py-2  px-4 items-center bg-white/70 rounded-full flex-1 my-2'>

                                                        <div className=" flex items-center gap-2">
                                                            <Image className='rounded-full' src={player.user?.image ?? '/ava.jpeg'} alt={player.user?.name ?? 'Player'} width={32} height={32} />
                                                            <span className='text-swhite sm:text-xl text-md font-bold'>{player.user.name}</span>
                                                        </div>
                                                        <span className='text-xl font-bold'>{player.score}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }

                                    </div>
                                    <div className="t sm:p-3 sm:mr-[rem] sm:px-3 sm:pr-24 sm:mx-8 space-x-3 col-span-2">
                                        <h2 className='sm:text-4xl text-xl font-bold mt-6'>Categories Leaderboard</h2>
                                        <div className="grid sm:grid-cols-2 sm:my-6 my-3 sm:gap-6 gap-3">
                                            {
                                                Object.keys(sortedData.groupedAndSortedIntraScores).map((category) => (
                                                    <div key={category} className={`flex rounded-md divide-y divide-gray-300 flex-col border p-3 border-dashed border-gray-300 ${colors[category as keyof typeof colors]}`}>
                                                        <h3 className='text-md sm:text-xl font-bold capitalize'>{category.toLowerCase()} Questions</h3>
                                                        <div className="d">
                                                            {
                                                                sortedData.groupedAndSortedIntraScores[category].map((player: any, index: number) => (
                                                                    <div key={player.id} className="index text-md sm:text-xl flex items-center gap-2 w-full">
                                                                        <span className='sm:text-xl text-md text-white font-bold'>{index + 1}</span>
                                                                        <div className='flex justify-between py-2  px-4 items-center bg-white/70 rounded-full flex-1 my-2 gap-2'>
                                                                            <div className=" flex items-center gap-2">
                                                                                <Image className='rounded-full' src={player.userImage} alt={player.userName} width={32} height={32} />
                                                                                <span className='text-swhite sm:text-xl text-sm font-bold'>{player.userName}</span>
                                                                            </div>
                                                                            <span className='text-md font-bold'>{player.score}</span>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>

                                                ))
                                            }

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                :
                <div className='h-screen w-screen flex justify-center items-center'>
                    <div className='text-xl font-bold'>
                        <button
                            type="button"
                            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <PiEmptyFill />
                            <span className="mt-2 block text-sm font-semibold text-gray-900">No stats yet. Let people Play the game to see the leaderboard.</span>
                        </button>
                    </div>
                </div>
            }
        </>
    );
};

export default PointsSubscriber;