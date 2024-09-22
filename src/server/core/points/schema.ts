import { z } from "zod";
export const PointsSchema = z.object({
    idtype: z.enum(['DIVERSITY', 'STORYTELLING', 'CHALLENGE', 'UNITY']), // Provide the enum with at least one argument
    score: z.number(),
    question: z.string()
});


export const IntraScoreQuestionSchema = z.object({
    idtype: z.enum(['DIVERSITY', 'STORYTELLING', 'CHALLENGE', 'UNITY']),
    question: z.string(),
    intraScoreId: z.string()
})