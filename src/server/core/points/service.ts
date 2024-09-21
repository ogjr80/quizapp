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
        console.log({ u: ctx.session, s: ctx.user })
        try {
            const { idtype, score } = points;
            const scores = score * 10
            const recordedSchools = await this.db.points.findUnique(
                {
                    where: {
                        userId: ctx.user.id
                    }
                }
            )
            if (!recordedSchools?.stages.includes(idtype)) {
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

                            push: ScoreTypes[idtype],
                        }, // Directly assign the value
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
                message: ''
            }
        } catch (error) {
            throw error;
        }
    }


}
