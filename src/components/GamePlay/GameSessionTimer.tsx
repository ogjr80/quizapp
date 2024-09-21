'use client'
import { useGameSession } from '@/hooks/useGameSession'
import { useScores } from '@/hooks/stores/useScores'
import React, { useState, useEffect } from 'react'
import useSessionCounter from '@/hooks/useSessionCounter'
import { usePoints } from '@/hooks/usePoints'

export const GameSessionTimer = () => {
    const {
        loading,
        session,
        timeLeft,
        isTimeUp,
        progress
    } = useSessionCounter()
    const { points } = usePoints()

    if (loading) return <>loading</>

    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className="relative w-24 h-24">
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
                    stroke={parseInt(timeLeft.split(':')[0]) < 3 ? '#ef4444' : '#22c55e'}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {session && session.isActive && (
                    <>
                        {isTimeUp ? (
                            <span className="text-3xl font-bold">{points?.score ?? 0}</span>
                        ) : (
                            <span className={`text-lg font-bold ${parseInt(timeLeft.split(':')[0]) < 3 ? 'text-red-500' : ''}`}>
                                {timeLeft}
                            </span>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default GameSessionTimer
