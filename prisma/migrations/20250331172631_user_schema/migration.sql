/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Project` table. All the data in the column will be lost.
  - Added the required column `ownerEmail` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_ownerId_fkey`;

-- DropIndex
DROP INDEX `Project_ownerId_fkey` ON `Project`;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `ownerId`,
    ADD COLUMN `ownerEmail` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `email` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_ownerEmail_fkey` FOREIGN KEY (`ownerEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
