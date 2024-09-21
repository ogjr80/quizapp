import { z } from "zod";
import { PointsSchema } from "./schema";

export type IPointsSchema = z.infer<typeof PointsSchema>;
