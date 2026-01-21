/*
  Warnings:

  - You are about to drop the column `description` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `services` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mainContent` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageTitle` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "services" DROP COLUMN "description",
DROP COLUMN "icon",
DROP COLUMN "title",
ADD COLUMN     "backgroundImage" TEXT,
ADD COLUMN     "cardContents" TEXT,
ADD COLUMN     "footerContent" TEXT,
ADD COLUMN     "footerTitle" TEXT,
ADD COLUMN     "mainContent" TEXT NOT NULL,
ADD COLUMN     "pageSubtitle" TEXT,
ADD COLUMN     "pageTitle" TEXT NOT NULL,
ADD COLUMN     "servicesList" TEXT,
ADD COLUMN     "servicesTitle" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "whyChoosePoints" TEXT,
ADD COLUMN     "whyChooseTitle" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");
