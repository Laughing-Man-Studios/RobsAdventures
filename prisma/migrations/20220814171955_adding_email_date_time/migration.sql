/*
  Warnings:

  - Added the required column `dateTime` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateTime` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;
