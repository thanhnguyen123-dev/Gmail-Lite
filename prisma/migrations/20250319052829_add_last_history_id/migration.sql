-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastInboxSyncedHistoryId" TEXT,
ADD COLUMN     "lastSentSyncedHistoryId" TEXT;
