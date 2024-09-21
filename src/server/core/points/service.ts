import { db as database } from "@/lib/prisma";
import { HeritageContext } from "@/types/context";
import { PrismaClient, ScoreTypes } from "@prisma/client";
import { IPointsSchema } from "./types";

export class PointsService {

    private static readonly db: PrismaClient = database;
    static getUserPoints(ctx: HeritageContext): any {
        try {
            return this.db.points.findUnique({
                where: { userId: ctx.user.id }
            })
        } catch (error) {
            return null
        }
    }
    static async submitQuizScore(points: IPointsSchema, ctx: HeritageContext) {

        try {
            const user = await this.db.user.findUnique({
                where: {
                    id: ctx.user.id
                },
                include: { gameSession: true, teamSession: true }
            })
            const sesion = user?.gameSession ?? user?.teamSession
            if (sesion) {
                const { idtype, score } = points;
                const scores = score * 10
                const recordedScores = await this.db.points.findUnique(
                    {
                        where: {
                            userId: ctx.user.id
                        }
                    }
                )
                const pts = await this.db.points.upsert({
                    where: {
                        userId: ctx.user.id,
                    },
                    create: {
                        stages: [idtype],
                        score: scores,
                        user: {
                            connect: {
                                id: ctx.user.id,
                            },
                        },
                    },
                    update: {
                        stages: {
                            set: [
                                ...new Set([
                                    ...(recordedScores?.stages || []),
                                    ScoreTypes[idtype]
                                ])
                            ]
                        },
                        score: {
                            increment: scores
                        },
                        user: {
                            connect: {
                                id: ctx.user.id,
                            },
                        },
                    },
                });
                return {
                    success: true,
                    message: "Quiz score submitted successfully",
                    pts
                };
            }
            return {
                success: false,
                message: "We could not record your score, session ended",
            }

        } catch (error) {
            return {
                success: false,
                message: "Unable t record your score"
            }
        }
    }


}
