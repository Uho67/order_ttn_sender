/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Package` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Package" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ttn" TEXT NOT NULL,
    "isSentToChat" BOOLEAN NOT NULL DEFAULT false,
    "telegram_message_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Package" ("createdAt", "id", "isSentToChat", "telegram_message_id", "ttn") SELECT "createdAt", "id", "isSentToChat", "telegram_message_id", "ttn" FROM "Package";
DROP TABLE "Package";
ALTER TABLE "new_Package" RENAME TO "Package";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
