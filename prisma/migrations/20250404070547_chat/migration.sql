/*
  Warnings:

  - You are about to drop the column `botResponse` on the `chatHistory` table. All the data in the column will be lost.
  - You are about to drop the column `timeStamp` on the `chatHistory` table. All the data in the column will be lost.
  - You are about to drop the column `userMessage` on the `chatHistory` table. All the data in the column will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sessionId]` on the table `chatHistory` will be added. If there are existing duplicate values, this will fail.
  - Made the column `sessionId` on table `chatHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_authorId_fkey`;

-- AlterTable
ALTER TABLE `chatHistory` DROP COLUMN `botResponse`,
    DROP COLUMN `timeStamp`,
    DROP COLUMN `userMessage`,
    ADD COLUMN `conversationName` VARCHAR(255) NULL,
    ADD COLUMN `lastActive` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `sessionId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `post`;

-- CreateTable
CREATE TABLE `message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `userMessage` TEXT NOT NULL,
    `botResponse` LONGTEXT NOT NULL,
    `timeStamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sessionId` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `chatHistory_sessionId_key` ON `chatHistory`(`sessionId`);

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `chatHistory`(`sessionId`) ON DELETE RESTRICT ON UPDATE CASCADE;
