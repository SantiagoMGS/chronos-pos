/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "item_code_key" ON "item"("code");
