/*
  Warnings:

  - You are about to drop the column `lastInboxSyncedHistoryId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastSentSyncedHistoryId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastInboxSyncedHistoryId",
DROP COLUMN "lastSentSyncedHistoryId",
ADD COLUMN     "lastInboxPageToken" TEXT,
ADD COLUMN     "lastSentPageToken" TEXT;
