'use client'
import { Question } from '@/types/questions'

export const ShuffleQuestions = (array: Question[]) => {
    // Create a copy of the array
    const availableQuestions = [...array]

    // Shuffle the available questions
    for (let i = availableQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[availableQuestions[i], availableQuestions[j]] = [availableQuestions[j], availableQuestions[i]]
        console.log(`Swapped ${i} with ${j}:`, availableQuestions.map(q => q.type)) // Add this line
    }

    // Pick the first question from the shuffled array
    const newQuestion: Question = availableQuestions[0]
    console.log("Shuffled array:", availableQuestions.map(q => q.type)) // Add this line
    console.log("Selected question:", newQuestion)

    // Return the entire shuffled array and the selected question
    return newQuestion
}

export const isFull = (file: Question, files: Question[]) => {
    const a = [null, { type: 0 }, { type: 1 }, null, { type: 2 }]

    // Remove null values and keep only objects with a 'type' property
    const filteredArray = files.filter((item: any) =>
        item !== null && typeof item === 'object'
    ).filter(e => e.type == file.type)

    const isTen = filteredArray.length >= 10
    return isTen
}