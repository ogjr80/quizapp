-- DropForeignKey
ALTER TABLE "GameSession" DROP CONSTRAINT "GameSession_teamSessionId_fkey";

-- AlterTable
ALTER TABLE "GameSession" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "teamSessionId" DROP NOT NULL,
ALTER COLUMN "endTime" SET DEFAULT NOW() + INTERVAL '12 minutes';

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_teamSessionId_fkey" FOREIGN KEY ("teamSessionId") REFERENCES "TeamSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
