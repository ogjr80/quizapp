import { router } from "./trpc";
import { pointsRouter } from "./routes/points";

export const appRouter = router({
  points: pointsRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
