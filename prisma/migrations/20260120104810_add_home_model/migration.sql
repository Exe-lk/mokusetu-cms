-- CreateTable
CREATE TABLE "home" (
    "id" TEXT NOT NULL,
    "titleHero" TEXT,
    "contentHero" TEXT,
    "globalPartners" TEXT,
    "yearsExperiences" TEXT,
    "successRate" TEXT,
    "aboutTitle" TEXT,
    "aboutContent" TEXT,
    "threeCards" TEXT,
    "whyChooseTitle" TEXT,
    "whyChooseSubtitle" TEXT,
    "whyChooseCards" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_pkey" PRIMARY KEY ("id")
);
