/*
  Warnings:

  - You are about to drop the column `authorId` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_authorId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "authorId";

-- CreateTable
CREATE TABLE "about_page" (
    "id" TEXT NOT NULL,
    "backgroundImage" TEXT,
    "pageTitle" TEXT NOT NULL DEFAULT 'About Us',
    "pageSubtitle" TEXT,
    "storySections" TEXT,
    "missionTitle" TEXT,
    "missionContent" TEXT,
    "visionTitle" TEXT,
    "visionContent" TEXT,
    "brandArchetype" TEXT,
    "coreValues" TEXT,
    "timeline" TEXT,
    "ctaTitle" TEXT,
    "ctaContent" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_page_pkey" PRIMARY KEY ("id")
);
