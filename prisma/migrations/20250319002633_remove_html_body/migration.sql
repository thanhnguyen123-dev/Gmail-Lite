/*
  Warnings:

  - You are about to drop the column `htmlBody` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `htmlBodyUrl` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "htmlBody",
DROP COLUMN "htmlBodyUrl",
ADD COLUMN     "htmlUrl" TEXT;
