-- AlterTable
ALTER TABLE `User` ADD COLUMN `lastLoginAt` DATETIME(3) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL;
