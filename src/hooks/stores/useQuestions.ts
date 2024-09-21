import { IQuestionsHook, Question } from "@/types/questions";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useQuestions = create(persist<IQuestionsHook>((set) => ({
    current: null,
    previous: [],
    setCurrent: (question: Question) => set((state: any) => ({ previous: [...state.previous, state.current], current: question }))
}), {
    name: 'shuffled-questions'
}),)