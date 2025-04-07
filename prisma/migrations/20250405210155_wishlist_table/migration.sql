-- DropForeignKey
ALTER TABLE `suggestion` DROP FOREIGN KEY `suggestion_userId_fkey`;

-- AlterTable
ALTER TABLE `suggestion` ADD COLUMN `latitude` VARCHAR(191) NULL,
    ADD COLUMN `longitude` VARCHAR(191) NULL,
    MODIFY `upVotes` INTEGER NULL,
    MODIFY `downVotes` INTEGER NULL,
    MODIFY `timeAvailable` VARCHAR(191) NULL,
    MODIFY `cost` INTEGER NULL,
    MODIFY `image` TINYTEXT NULL,
    MODIFY `phoneNum` VARCHAR(15) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `suggestionId` INTEGER NULL;

-- CreateTable
CREATE TABLE `userOnsuggestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `suggestionId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userOnsuggestion` ADD CONSTRAINT `userOnsuggestion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userOnsuggestion` ADD CONSTRAINT `userOnsuggestion_suggestionId_fkey` FOREIGN KEY (`suggestionId`) REFERENCES `suggestion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
