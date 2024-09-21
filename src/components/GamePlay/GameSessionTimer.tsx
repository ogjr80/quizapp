'use client'
import { useGameSession } from '@/hooks/useGameSession'
import { useScores } from '@/hooks/stores/useScores'
import React, { useState, useEffect } from 'react'

export const GameSessionTimer = () => {
    const { session, loading } = useGameSession() as any
    const { score } = useScores()
    const [timeLeft, setTimeLeft] = useState<string>('')
    const [isTimeUp, setIsTimeUp] = useState(false)

    useEffect(() => {
        if (session && session.isActive && session.endTime) {
            const timer = setInterval(() => {
                const now = new Date().getTime()
                const end = new Date(session.endTime).getTime()
                const difference = end - now

                if (difference > 0) {
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000)
                    setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
                } else {
                    setTimeLeft('00:00')
                    setIsTimeUp(true)
                    clearInterval(timer)
                }
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [session])

    if (loading) return <>loading</>

    return (
        <div className={`${parseInt(timeLeft.split(':')[0]) < 3 ? 'text-red-500' : ''}`}>
            {session && session.isActive && (
                <>
                    <div className="span">

                    </div>
                    {isTimeUp ? (
                        <span>{score}</span>
                    ) : (
                        <span>{timeLeft}</span>
                    )}
                </>
            )}
        </div>
    )
}

export default GameSessionTimer
