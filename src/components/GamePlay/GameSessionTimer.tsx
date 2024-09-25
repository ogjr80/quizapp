'use client'
import React, { } from 'react'
import useSessionCounter from '@/hooks/useSessionCounter'
import { usePoints } from '@/hooks/usePoints'
import Link from 'next/link'

export const GameSessionTimer = ({ style = "sm:w-24 sm:h-24 w-16 h-16" }) => {
    const {
        loading,
        timeLeft,
        session,
        progress
    } = useSessionCounter()
    const { points } = usePoints()

    if (loading) return <>loading</>

    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className={`relative ${style}`}>
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="transparent"
                />
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={parseInt(timeLeft.split(':')[0]) < 3 ? '#ef4444' : session?.isActive ? '#22c55e' : '#e5e7eb'}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <>
                    {!session?.isActive ? (
                        <Link href='/leaderboard' className="font-bold group justify-center items-center flex">
                            <span className='text-xs group-hover:block hidden'>Leaderboard</span>
                            <span className='sm:text-3xl text-lg group-hover:hidden font-bold'>
                                {points?.score ?? 0}</span> </Link>
                    ) : (
                        <span className={`sm:text-lg text-xs font-bold ${parseInt(timeLeft.split(':')[0]) < 3 ? 'text-red-500' : ''}`}>
                            {timeLeft}
                        </span>
                    )}
                </>
            </div>
        </div >
    )
}

export default GameSessionTimer
