/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Points` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Points_userId_key" ON "Points"("userId");
