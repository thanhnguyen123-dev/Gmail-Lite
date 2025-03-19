/*
  Warnings:

  - You are about to drop the `Header` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessagePart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessagePartBody` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Header" DROP CONSTRAINT "Header_messagePartId_fkey";

-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "lastMessageDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "Header";

-- DropTable
DROP TABLE "MessagePart";

-- DropTable
DROP TABLE "MessagePartBody";
