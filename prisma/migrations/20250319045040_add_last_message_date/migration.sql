/*
  Warnings:

  - Changed the type of `internalDate` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "internalDate",
ADD COLUMN     "internalDate" TIMESTAMP(3) NOT NULL;
