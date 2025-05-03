/*
  Warnings:

  - The primary key for the `Drive` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Drive` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drive" (
    "ttn" TEXT NOT NULL PRIMARY KEY,
    "ttn_value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Drive" ("createdAt", "ttn", "ttn_value") SELECT "createdAt", "ttn", "ttn_value" FROM "Drive";
DROP TABLE "Drive";
ALTER TABLE "new_Drive" RENAME TO "Drive";
CREATE UNIQUE INDEX "Drive_ttn_key" ON "Drive"("ttn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
