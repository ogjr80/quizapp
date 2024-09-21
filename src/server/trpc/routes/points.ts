import { z } from "zod";
import { authProcedure, publicProcedure, router } from "../trpc";
import { PointsSchema } from "@/server/core/points/schema";
import { PointsService } from "@/server/core/points/service";
import { Points } from "@prisma/client";
import EventEmitter, { on } from 'events';
const ee = new EventEmitter();
import { observable } from "@trpc/server/observable";

export const pointsRouter = router({
  submitQuizScore: authProcedure
    .input(
      PointsSchema
    )
    .mutation(async ({ input, ctx }) => {
      return await PointsService.submitQuizScore(input, ctx);
    }),

  getUserScores: authProcedure
    .query(async ({ ctx }) => {
      return await PointsService.getUserPoints(ctx)

    }),
  onAdd: publicProcedure.subscription(() => {
    // return an `observable` with a callback which is triggered immediately
    return observable<Points>((emit) => {
      const onAdd = (data: Points) => {
        // emit data to client
        emit.next(data);
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on('add', onAdd);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off('add', onAdd);
      };
    });
  })
});
