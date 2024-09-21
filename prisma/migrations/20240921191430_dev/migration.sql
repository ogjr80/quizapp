-- AlterTable
ALTER TABLE "GameSession" ALTER COLUMN "endTime" SET DEFAULT NOW() + INTERVAL '12 minutes';

-- CreateTable
CREATE TABLE "IntraScores" (
    "id" TEXT NOT NULL,
    "pointsId" TEXT,
    "score" INTEGER NOT NULL,
    "type" "ScoreTypes" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntraScores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IntraScores" ADD CONSTRAINT "IntraScores_pointsId_fkey" FOREIGN KEY ("pointsId") REFERENCES "Points"("id") ON DELETE SET NULL ON UPDATE CASCADE;
