/*
  Warnings:

  - You are about to drop the column `campaignCategoriesId` on the `campaign` table. All the data in the column will be lost.
  - Added the required column `campaignCategoryId` to the `campaign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `campaign` DROP FOREIGN KEY `Campaign_campaignCategoriesId_fkey`;

-- AlterTable
ALTER TABLE `campaign` DROP COLUMN `campaignCategoriesId`,
    ADD COLUMN `campaignCategoryId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Campaign_campaignCategoriesId_fkey` ON `campaign`(`campaignCategoryId`);

-- AddForeignKey
ALTER TABLE `campaign` ADD CONSTRAINT `Campaign_campaignCategoriesId_fkey` FOREIGN KEY (`campaignCategoryId`) REFERENCES `campaigncategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
