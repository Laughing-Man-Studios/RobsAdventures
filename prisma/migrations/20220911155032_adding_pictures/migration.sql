-- CreateTable
CREATE TABLE "Pictures" (
    "url" TEXT NOT NULL,
    "tripId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Pictures_url_key" ON "Pictures"("url");

-- AddForeignKey
ALTER TABLE "Pictures" ADD CONSTRAINT "Pictures_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
