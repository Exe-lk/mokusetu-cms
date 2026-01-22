import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, createdResponse, errorResponse } from '@/lib/api-response';

function parseServiceData(service: any) {
  return {
    ...service,
    cardContents: service.cardContents ? JSON.parse(service.cardContents) : [],
    servicesList: service.servicesList ? JSON.parse(service.servicesList) : [],
    whyChoosePoints: service.whyChoosePoints ? JSON.parse(service.whyChoosePoints) : [],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    const where: any = {};
    
    if (active !== null) {
      where.active = active === 'true';
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    const parsedServices = services.map(parseServiceData);

    return successResponse({ services: parsedServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      pageTitle, 
      pageSubtitle,
      listImage,
      summary,
      mainContent,
      backgroundImage,
      cardContents,
      servicesTitle,
      servicesList,
      whyChooseTitle,
      whyChoosePoints,
      footerTitle,
      footerContent,
      slug,
      active, 
      order 
    } = body;

    if (!pageTitle || !mainContent) {
      return errorResponse(new Error('Page title and main content are required'), 400);
    }

    const serviceSlug = slug || pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const data: any = {
      pageTitle,
      pageSubtitle,
      listImage,
      summary,
      mainContent,
      backgroundImage,
      cardContents: cardContents ? JSON.stringify(cardContents) : null,
      servicesTitle,
      servicesList: servicesList ? JSON.stringify(servicesList) : null,
      whyChooseTitle,
      whyChoosePoints: whyChoosePoints ? JSON.stringify(whyChoosePoints) : null,
      footerTitle,
      footerContent,
      slug: serviceSlug,
      active: active ?? true,
      order: order ?? 0,
    };

    const service = await prisma.service.create({
      data,
    });

    return createdResponse(parseServiceData(service));
  } catch (error) {
    console.error('Error creating service:', error);
    return errorResponse(error);
  }
}
