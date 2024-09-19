'use client'
import { files } from '@/app/universe/quizdata'
import { QuizComponent } from '@opherlabs/components'
import React from 'react'

function SubUniverse() {
  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: 'url("/cards/flag.svg")' }}
    >
      <div className="rounded-lg w-full">
        <QuizComponent url="pubic" files={files} />
      </div>
    </div>
  )
}
export default SubUniverse