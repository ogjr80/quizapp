-- AlterTable
ALTER TABLE "GameSession" ALTER COLUMN "endTime" SET DEFAULT NOW() + INTERVAL '12 minutes';

-- AlterTable
ALTER TABLE "TeamSession" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
