-- AlterTable
ALTER TABLE `Sprint` MODIFY `status` ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PLANNED';
