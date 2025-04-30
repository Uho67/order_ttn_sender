/*
  Warnings:

  - You are about to drop the column `telegram_message_id` on the `Package` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Package" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ttn" TEXT NOT NULL,
    "isSentToChat" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" INTEGER NOT NULL
);
INSERT INTO "new_Package" ("createdAt", "id", "isSentToChat", "ttn") SELECT "createdAt", "id", "isSentToChat", "ttn" FROM "Package";
DROP TABLE "Package";
ALTER TABLE "new_Package" RENAME TO "Package";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
