-- AlterTable
ALTER TABLE "GameSession" ALTER COLUMN "endTime" SET DEFAULT NOW() + INTERVAL '12 minutes';
