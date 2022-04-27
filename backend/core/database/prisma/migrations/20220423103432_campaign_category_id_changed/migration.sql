-- DropForeignKey
ALTER TABLE `campaign` DROP FOREIGN KEY `Campaign_campaignCategoriesId_fkey`;

-- AddForeignKey
ALTER TABLE `Campaign` ADD CONSTRAINT `Campaign_campaignCategoryId_fkey` FOREIGN KEY (`campaignCategoryId`) REFERENCES `CampaignCategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
