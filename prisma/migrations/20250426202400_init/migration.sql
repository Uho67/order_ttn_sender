-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telegram_chat_id" TEXT NOT NULL,
    "telegram_message_id" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "nova_post_ttn" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
