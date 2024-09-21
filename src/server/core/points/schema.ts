import { z } from "zod";
export const PointsSchema = z.object({
    idtype: z.enum(['DIVERSITY', 'STORYTELLING', 'CHALLENGE', 'UNITY']), // Provide the enum with at least one argument
    score: z.number(),
});
