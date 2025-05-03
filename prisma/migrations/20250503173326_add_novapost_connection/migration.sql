-- CreateTable
CREATE TABLE "NovaPostConnection" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "NovaPostConnection_name_key" ON "NovaPostConnection"("name");
