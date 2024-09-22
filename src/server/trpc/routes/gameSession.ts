import { GameSessionService } from "@/server/core/gameSession"
import { authProcedure, router } from "../trpc"
import { z } from "zod"

export const gameSessionRouter = router({
    getIndividualGameSession: authProcedure.query(async ({ ctx }) => {
        return await GameSessionService.getGameSession('individual', ctx)
    }),
    getTeamlGameSession: authProcedure.query(async ({ ctx }) => {
        return await GameSessionService.getGameSession('team', ctx)
    }),
    saveGameSession: authProcedure.input(z.object({
        type: z.enum(['individual', 'team']),
        team: z.string().optional().nullable()
    })).mutation(async ({ input, ctx }) => {
        return await GameSessionService.saveSession(input.type, ctx, input.team as any)
    }),
    endGameSession: authProcedure.mutation(async ({ ctx }) => {
        return await GameSessionService.endGameSession(ctx)
    })
})