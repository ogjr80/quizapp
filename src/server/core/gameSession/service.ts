import { db } from "@/lib/prisma";
import { HeritageContext } from "@/types/context";
import { PrismaClient } from "@prisma/client";


export class GameSessionService {

    private static database: PrismaClient = db
    static getGameSession = async (mode: "individual" | "team", ctx: HeritageContext,) => {
        try {
            if (mode == "individual") {
                return await this.database.gameSession.findUnique({
                    where: {
                        userId: ctx.user.id
                    }
                })
            }
            const team = await this.database.user.findUnique({
                where: {
                    id: ctx.user.id
                },
                include: {
                    teamSession: true
                }
            })
            return team?.teamSession
        } catch (error) {
            return null

        }
    }

    static saveSession = async (type: "individual" | "team", ctx: HeritageContext, team?: string) => {
        try {
            console.log(ctx.user)
            const data = type === "individual" ? {
                userId: ctx.user.id, isActive: true
            } : {
                teamSessionId: team as string
            }
            const session = await this.database.gameSession.create({
                data
            })
            return session
        } catch (error) {
            return null
        }
    }

}