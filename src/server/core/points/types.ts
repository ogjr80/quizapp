import { z } from "zod";
import { IntraScoreQuestionSchema, PointsSchema } from "./schema";

export type IPointsSchema = z.infer<typeof PointsSchema>;
export declare type IntraScoreQuestionSchema = z.infer<typeof IntraScoreQuestionSchema>;
