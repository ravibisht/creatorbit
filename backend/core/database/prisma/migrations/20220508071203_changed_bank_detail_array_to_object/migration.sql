/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `BankDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `BankDetail_userId_key` ON `BankDetail`(`userId`);
