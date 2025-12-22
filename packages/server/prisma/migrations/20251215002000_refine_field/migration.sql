/*
  Warnings:

  - You are about to drop the column `desciption` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `desciption`,
    ADD COLUMN `description` TEXT NULL;
