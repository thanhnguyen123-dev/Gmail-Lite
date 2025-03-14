/*
  Warnings:

  - You are about to drop the column `sizeEstimate` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `MessagePart` table. All the data in the column will be lost.
  - You are about to drop the column `parentPartId` on the `MessagePart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessagePart" DROP CONSTRAINT "MessagePart_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessagePart" DROP CONSTRAINT "MessagePart_parentPartId_fkey";

-- DropForeignKey
ALTER TABLE "MessagePartBody" DROP CONSTRAINT "MessagePartBody_messagePartId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "sizeEstimate";

-- AlterTable
ALTER TABLE "MessagePart" DROP COLUMN "mimeType",
DROP COLUMN "parentPartId";
