import React from 'react'
export interface INavigationProps {
    session?: unknown;
    url?: string;
    activeQuestions?: unknown[]
    scores?: unknown
    leaderboard?: unknown
}
export const TopNavigation: React.FC<INavigationProps> = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 w-full'>

    </div>
  )
}
