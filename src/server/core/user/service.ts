import { db } from "@/lib/prisma"
import { PrismaClient } from "@prisma/client"

export class UserService {
    private static databsde: PrismaClient = db
    static findUserByUserName = async (email: string) => {
        try {
            return await this.databsde.user.findUnique({
                where: {
                    email
                }
            })
        } catch (error) {
            return null
        }
    }
}