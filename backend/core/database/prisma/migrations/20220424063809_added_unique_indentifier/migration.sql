/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `BankDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,userId]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,userId,campaignId]` on the table `CampaignApplication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,campaignId]` on the table `CampaignPlatforms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `BankDetail_id_userId_key` ON `BankDetail`(`id`, `userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Campaign_id_userId_key` ON `Campaign`(`id`, `userId`);

-- CreateIndex
CREATE UNIQUE INDEX `CampaignApplication_id_userId_campaignId_key` ON `CampaignApplication`(`id`, `userId`, `campaignId`);

-- CreateIndex
CREATE UNIQUE INDEX `CampaignPlatforms_id_campaignId_key` ON `CampaignPlatforms`(`id`, `campaignId`);
