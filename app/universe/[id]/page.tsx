'use client'
import { QuizComponent } from '@opherlabs/components'
import React from 'react'
import { files } from '../quizdata'

function SubUniverse() {
  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: 'url("/cards/flag.svg")' }}
    >
      <div className="rounded-lg w-full">
        <QuizComponent url="universe" files={files} />
      </div>
    </div>
  )
}
export default SubUniverse