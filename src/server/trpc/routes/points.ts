import { z } from "zod";
import { authProcedure, publicProcedure, router } from "../trpc";
import { PointsSchema } from "@/server/core/points/schema";
import { PointsService } from "@/server/core/points/service";

export const pointsRouter = router({
  submitQuizScore: authProcedure
    .input(
      PointsSchema
    )
    .mutation(async ({ input, ctx }) => {
      return await PointsService.submitQuizScore(input, ctx);
    }),

  getUserScores: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;

      const userScores = await prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { quiz: true },
      });

      const totalPoints = await prisma.user.findUnique({
        where: { id: userId },
        select: { totalPoints: true },
      });

      return {
        quizAttempts: userScores,
        totalPoints: totalPoints?.totalPoints || 0,
      };
    }),
});
