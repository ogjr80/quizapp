import { PrismaClient } from "@prisma/client";
import { Session, User } from "next-auth";

export type HeritageContext = {
    user?: User | any;
    db?: PrismaClient;
    res?: Response;
    req?: Request;
    session?: Session;
}