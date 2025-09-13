/*
  Warnings:

  - You are about to drop the column `documentType` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `itemType` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `documentType` on the `user_info` table. All the data in the column will be lost.
  - Added the required column `document_type` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_type` to the `item` table without a default value. This is not possible if the table is not empty.
  - Made the column `measurement_unit_id` on table `item` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `document_type` to the `user_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer" DROP COLUMN "documentType",
ADD COLUMN     "document_type" "DocumentType" NOT NULL;

-- AlterTable
ALTER TABLE "item" DROP COLUMN "itemType",
ADD COLUMN     "item_type" "ItemType" NOT NULL,
ALTER COLUMN "measurement_unit_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_info" DROP COLUMN "documentType",
ADD COLUMN     "document_type" "DocumentType" NOT NULL;
