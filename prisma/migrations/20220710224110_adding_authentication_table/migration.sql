/*
  Warnings:

  - A unique constraint covering the columns `[gmailId]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gmailId]` on the table `Messages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Authentication" (
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_name_key" ON "Authentication"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Location_gmailId_key" ON "Location"("gmailId");

-- CreateIndex
CREATE UNIQUE INDEX "Messages_gmailId_key" ON "Messages"("gmailId");
