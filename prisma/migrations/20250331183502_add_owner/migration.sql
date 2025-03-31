/*
  Warnings:

  - Added the required column `ownerEmail` to the `Sprint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerEmail` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Sprint` ADD COLUMN `ownerEmail` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Task` ADD COLUMN `ownerEmail` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Sprint` ADD CONSTRAINT `Sprint_ownerEmail_fkey` FOREIGN KEY (`ownerEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_ownerEmail_fkey` FOREIGN KEY (`ownerEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
