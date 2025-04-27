-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telegram_chat_id" TEXT NOT NULL,
    "telegram_message_id" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "nova_post_ttn" TEXT,
    "isSentToChat" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("createdAt", "customer_phone", "id", "nova_post_ttn", "telegram_chat_id", "telegram_message_id", "updatedAt") SELECT "createdAt", "customer_phone", "id", "nova_post_ttn", "telegram_chat_id", "telegram_message_id", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
