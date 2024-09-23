'use client'
import { AnimatedBackground, QuizComponent } from '@/components'
import { QuizCardsData } from '@/data'
import React, { useState } from 'react'

function PublicIdPage() {
    return (
        <div className='bg'>
            <AnimatedBackground />
            <QuizComponent files={QuizCardsData as any} url={'universe'} />
        </div>
    )
}

export default PublicIdPage