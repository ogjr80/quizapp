import { create } from 'zustand'
import { persist, createJSONStorage } from "zustand/middleware"
export const useScores = create(persist<IScoreDto>((set) => ({
    score: 0,
    setScore: (score: number) => set({ score }),
    clearScore: () => set({ score: 0 })
}), {
    name: "heritage-score", storage: createJSONStorage(() => sessionStorage)
}))

export declare interface IScoreDto {
    score: number | null,
    setScore: (score: number) => void,
    clearScore: () => void
}