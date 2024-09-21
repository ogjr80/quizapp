'use client'
import { useGameSession } from '@/hooks/useGameSession'
import React, { useState, useEffect } from 'react'

export const GameSessionTimer = () => {
    const { session, loading } = useGameSession() as any
    const [timeLeft, setTimeLeft] = useState<string>('')

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
                    clearInterval(timer)
                }
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [session])

    if (loading) return <>loading</>

    return (
        <div className={`${parseInt(timeLeft.split(':')[0]) < 3 ? 'text-red-500' : ''}`}>
            {session && session.isActive && timeLeft && (
                <span>{timeLeft}</span>
            )}
        </div>
    )
}
