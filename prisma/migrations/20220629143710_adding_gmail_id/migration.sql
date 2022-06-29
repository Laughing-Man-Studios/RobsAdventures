/*
  Warnings:

  - Added the required column `gmailId` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gmailId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "gmailId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "gmailId" TEXT NOT NULL;
