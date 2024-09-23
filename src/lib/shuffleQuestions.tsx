'use client'
import { Question } from '@/types/questions'
import { ScoreTypes } from '@prisma/client';

export const ShuffleQuestions = (array: Question[]) => {
    // Create a copy of the array
    const availableQuestions = [...array]

    // Shuffle the available questions
    for (let i = availableQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[availableQuestions[i], availableQuestions[j]] = [availableQuestions[j], availableQuestions[i]]
    }

    // Pick the first question from the shuffled array
    const newQuestion: Question = availableQuestions[0] ?? availableQuestions[1]

    // Return the entire shuffled array and the selected question
    return newQuestion
}

export const isFull = (file: Question, files: { type: ScoreTypes, name: string }[]) => {

    // Remove null values and keep only objects with a 'type' property
    const filteredArray = files && files.length > 0 ? files.filter(e => e.type === file.type) : []

    return filteredArray.length <= 10
}