/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `comics` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `galleries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comics" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrls" TEXT[];

-- AlterTable
ALTER TABLE "galleries" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrls" TEXT[];
