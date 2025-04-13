/*
  Warnings:

  - The `jobOverview` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `responsibilities` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "jobOverview",
ADD COLUMN     "jobOverview" TEXT[],
DROP COLUMN "responsibilities",
ADD COLUMN     "responsibilities" TEXT[];
