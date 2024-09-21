import { initTRPC, TRPCError } from '@trpc/server';
import { createHeritageContext } from './context';
import { ZodError } from 'zod';
import superjson from "superjson"
const t = initTRPC.context<typeof createHeritageContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                error,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(({ ctx, next }: any) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
});
export const middleware = t.middleware;