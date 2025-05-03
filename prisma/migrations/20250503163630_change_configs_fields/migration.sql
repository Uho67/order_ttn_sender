/*
  Warnings:

  - The primary key for the `Configs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ttn` on the `Configs` table. All the data in the column will be lost.
  - You are about to drop the column `ttn_value` on the `Configs` table. All the data in the column will be lost.
  - Added the required column `config_path` to the `Configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `config_value` to the `Configs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Configs" (
    "config_path" TEXT NOT NULL PRIMARY KEY,
    "config_value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Configs" ("createdAt") SELECT "createdAt" FROM "Configs";
DROP TABLE "Configs";
ALTER TABLE "new_Configs" RENAME TO "Configs";
CREATE UNIQUE INDEX "Configs_config_path_key" ON "Configs"("config_path");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
