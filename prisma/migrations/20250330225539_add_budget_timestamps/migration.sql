/*
  Warnings:

  - You are about to drop the column `created_at` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `totalBudget` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `budget` table. All the data in the column will be lost.
  - Added the required column `limit` to the `budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `budget` DROP COLUMN `created_at`,
    DROP COLUMN `totalBudget`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `limit` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
