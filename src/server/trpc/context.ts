import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { HeritageContext } from "@/types/context";
import { PrismaClient } from "@prisma/client";

export const createHeritageContext = async (opts: { headers: Headers }): Promise<HeritageContext> => {
    const session = await auth();
    return {
        session: session || undefined,
        user: session?.user,
        db: db as PrismaClient,
        ...opts,
    };
};
