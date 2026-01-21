import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

function parseHomeData(home: any) {
  if (!home) return null;

  return {
    ...home,
    serviceCards: home.serviceCards ? JSON.parse(home.serviceCards) : [],
    threeCards: home.threeCards ? JSON.parse(home.threeCards) : [],
    whyChooseCards: home.whyChooseCards ? JSON.parse(home.whyChooseCards) : [],
  };
}

export async function GET() {
  try {
    let home = await prisma.home.findFirst();

    if (!home) {
      home = await prisma.home.create({
        data: {},
      });
    }

    return successResponse(parseHomeData(home));
  } catch (error) {
    console.error('Error fetching home page:', error);
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      titleHero,
      contentHero,
      globalPartners,
      yearsExperiences,
      successRate,
      aboutTitle,
      aboutContent,
      serviceIcon,
      serviceServiceId,
      serviceTitle,
      serviceContent,
      serviceCards,
      threeCards,
      whyChooseTitle,
      whyChooseSubtitle,
      whyChooseCards,
    } = body;

    const existing = await prisma.home.findFirst();

    const data: any = {
      ...(titleHero !== undefined && { titleHero }),
      ...(contentHero !== undefined && { contentHero }),
      ...(globalPartners !== undefined && { globalPartners }),
      ...(yearsExperiences !== undefined && { yearsExperiences }),
      ...(successRate !== undefined && { successRate }),
      ...(aboutTitle !== undefined && { aboutTitle }),
      ...(aboutContent !== undefined && { aboutContent }),
      ...(serviceIcon !== undefined && { serviceIcon }),
      ...(serviceServiceId !== undefined && { serviceServiceId }),
      ...(serviceTitle !== undefined && { serviceTitle }),
      ...(serviceContent !== undefined && { serviceContent }),
      ...(serviceCards !== undefined && {
        serviceCards: JSON.stringify(serviceCards),
      }),
      ...(threeCards !== undefined && { threeCards: JSON.stringify(threeCards) }),
      ...(whyChooseTitle !== undefined && { whyChooseTitle }),
      ...(whyChooseSubtitle !== undefined && { whyChooseSubtitle }),
      ...(whyChooseCards !== undefined && {
        whyChooseCards: JSON.stringify(whyChooseCards),
      }),
    };

    const home = existing
      ? await prisma.home.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.home.create({
          data,
        });

    return successResponse(parseHomeData(home), 'Home page updated successfully');
  } catch (error) {
    console.error('Error updating home page:', error);
    return errorResponse(error);
  }
}

