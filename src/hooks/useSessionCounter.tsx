import React, { useEffect, useState } from 'react'
import { useScores } from './stores/useScores'
import { useGameSession } from './useGameSession'

export const useSessionCounter = () => {
    const { session, loading } = useGameSession() as any
    const [timeLeft, setTimeLeft] = useState<string>('')
    const [isTimeUp, setIsTimeUp] = useState(false)
    const [progress, setProgress] = useState(100)
    useEffect(() => {
        if (session && session.isActive && session.endTime) {
            const totalDuration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime()

            const timer = setInterval(() => {
                const now = new Date().getTime()
                const end = new Date(session.endTime).getTime()
                const difference = end - now

                if (difference > 0) {
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000)
                    setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
                    setProgress((difference / totalDuration) * 100)
                } else {
                    setTimeLeft('00:00')
                    setIsTimeUp(true)
                    setProgress(0)
                    clearInterval(timer)
                }
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [session])
    return {
        loading,
        session,
        timeLeft,
        isTimeUp,
        progress

    }
}

export default useSessionCounter