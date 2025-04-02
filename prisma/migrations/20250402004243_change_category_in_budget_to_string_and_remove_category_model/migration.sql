/*
  Warnings:

  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `category_budgetId_fkey`;

-- AlterTable
ALTER TABLE `budget` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT '';

-- DropTable
DROP TABLE `category`;
