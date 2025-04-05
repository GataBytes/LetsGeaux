/*
  Warnings:

  - You are about to drop the column `creator_id` on the `itinerary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `itinerary` DROP COLUMN `creator_id`,
    ADD COLUMN `creatorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `itinerary` ADD CONSTRAINT `itinerary_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
