/*
  Warnings:

  - A unique constraint covering the columns `[pointsId,type]` on the table `IntraScores` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "IntraScores_pointsId_idx";

-- DropIndex
DROP INDEX "IntraScores_pointsId_key";

-- DropIndex
DROP INDEX "IntraScores_type_key";

-- AlterTable
ALTER TABLE "GameSession" ALTER COLUMN "endTime" SET DEFAULT NOW() + INTERVAL '12 minutes';

-- CreateIndex
CREATE UNIQUE INDEX "IntraScores_pointsId_type_key" ON "IntraScores"("pointsId", "type");
