-- AlterTable
ALTER TABLE "item" ADD COLUMN     "measurement_unit_id" UUID;

-- CreateTable
CREATE TABLE "measurement_unit" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "measurement_unit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "measurement_unit_code_key" ON "measurement_unit"("code");

-- CreateIndex
CREATE UNIQUE INDEX "measurement_unit_name_key" ON "measurement_unit"("name");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_measurement_unit_id_fkey" FOREIGN KEY ("measurement_unit_id") REFERENCES "measurement_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
