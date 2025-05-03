/*
  Warnings:

  - You are about to drop the `Drive` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Drive";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Configs" (
    "ttn" TEXT NOT NULL PRIMARY KEY,
    "ttn_value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Configs_ttn_key" ON "Configs"("ttn");
