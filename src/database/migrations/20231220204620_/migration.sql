/*
  Warnings:

  - Added the required column `validated` to the `ProjectUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectUser" ADD COLUMN     "validated" BOOLEAN NOT NULL;
