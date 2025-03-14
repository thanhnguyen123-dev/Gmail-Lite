/*
  Warnings:

  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `raw` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeEstimate` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "userId",
ADD COLUMN     "raw" TEXT NOT NULL,
ADD COLUMN     "sizeEstimate" INTEGER NOT NULL,
ALTER COLUMN "internalDate" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "MessagePart" (
    "partId" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "parentPartId" TEXT,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessagePart_pkey" PRIMARY KEY ("partId")
);

-- CreateTable
CREATE TABLE "Header" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "messagePartId" TEXT NOT NULL,

    CONSTRAINT "Header_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessagePartBody" (
    "id" TEXT NOT NULL,
    "attachmentId" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "messagePartId" TEXT NOT NULL,

    CONSTRAINT "MessagePartBody_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessagePartBody_messagePartId_key" ON "MessagePartBody"("messagePartId");

-- AddForeignKey
ALTER TABLE "MessagePart" ADD CONSTRAINT "MessagePart_parentPartId_fkey" FOREIGN KEY ("parentPartId") REFERENCES "MessagePart"("partId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessagePart" ADD CONSTRAINT "MessagePart_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Header" ADD CONSTRAINT "Header_messagePartId_fkey" FOREIGN KEY ("messagePartId") REFERENCES "MessagePart"("partId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessagePartBody" ADD CONSTRAINT "MessagePartBody_messagePartId_fkey" FOREIGN KEY ("messagePartId") REFERENCES "MessagePart"("partId") ON DELETE CASCADE ON UPDATE CASCADE;
