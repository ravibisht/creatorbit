/*
  Warnings:

  - You are about to drop the column `plateform` on the `campaignplatforms` table. All the data in the column will be lost.
  - Added the required column `platform` to the `CampaignPlatforms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `campaignplatforms` DROP COLUMN `plateform`,
    ADD COLUMN `platform` ENUM('INSTAGRAME', 'YOUTUBE', 'FACEBOOK') NOT NULL;
