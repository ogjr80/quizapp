import { router } from "./trpc";
import { pointsRouter } from "./routes/points";
import { gameSessionRouter } from "./routes/gameSession";

export const appRouter = router({
  points: pointsRouter,
  gameSession: gameSessionRouter
  // Add other routers here
});

export type AppRouter = typeof appRouter;
