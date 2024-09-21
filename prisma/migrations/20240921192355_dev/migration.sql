/*
  Warnings:

  - A unique constraint covering the columns `[pointsId]` on the table `IntraScores` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GameSession" ALTER COLUMN "endTime" SET DEFAULT NOW() + INTERVAL '12 minutes';

-- CreateIndex
CREATE UNIQUE INDEX "IntraScores_pointsId_key" ON "IntraScores"("pointsId");

-- CreateIndex
CREATE INDEX "IntraScores_pointsId_idx" ON "IntraScores"("pointsId");
