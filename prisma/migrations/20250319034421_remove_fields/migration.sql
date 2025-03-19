/*
  Warnings:

  - You are about to drop the column `lastInboxPageToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastInboxSyncedHistoryId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastSentPageToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastSentSyncedHistoryId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastInboxPageToken",
DROP COLUMN "lastInboxSyncedHistoryId",
DROP COLUMN "lastSentPageToken",
DROP COLUMN "lastSentSyncedHistoryId";
