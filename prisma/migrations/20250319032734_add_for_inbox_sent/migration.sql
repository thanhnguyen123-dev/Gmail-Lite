/*
  Warnings:

  - You are about to drop the column `lastSyncedHistoryId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastSyncedHistoryId",
ADD COLUMN     "lastInboxSyncedHistoryId" TEXT,
ADD COLUMN     "lastSentSyncedHistoryId" TEXT;
