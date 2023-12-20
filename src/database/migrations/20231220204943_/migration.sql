/*
  Warnings:

  - You are about to drop the column `validated` on the `ProjectUser` table. All the data in the column will be lost.
  - You are about to drop the column `closeAt` on the `ProjectUserTeam` table. All the data in the column will be lost.
  - You are about to drop the column `lockAt` on the `ProjectUserTeam` table. All the data in the column will be lost.
  - Added the required column `isValidated` to the `ProjectUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closedAt` to the `ProjectUserTeam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lockedAt` to the `ProjectUserTeam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectUser" DROP COLUMN "validated",
ADD COLUMN     "isValidated" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ProjectUserTeam" DROP COLUMN "closeAt",
DROP COLUMN "lockAt",
ADD COLUMN     "closedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lockedAt" TIMESTAMP(3) NOT NULL;
