/*
  Warnings:

  - You are about to drop the column `type` on the `Points` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Points" DROP COLUMN "type",
ADD COLUMN     "stages" "ScoreTypes"[];
