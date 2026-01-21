import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';

function parseServiceData(service: any) {
  return {
    ...service,
    cardContents: service.cardContents ? JSON.parse(service.cardContents) : [],
    servicesList: service.servicesList ? JSON.parse(service.servicesList) : [],
    whyChoosePoints: service.whyChoosePoints ? JSON.parse(service.whyChoosePoints) : [],
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return notFoundResponse('Service');
    }

    return successResponse(parseServiceData(service));
  } catch (error) {
    console.error('Error fetching service:', error);
    return errorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updateData: any = {
      ...(pageTitle !== undefined && { pageTitle }),
      ...(pageSubtitle !== undefined && { pageSubtitle }),
      ...(listImage !== undefined && { listImage }),
      ...(summary !== undefined && { summary }),
      ...(mainContent !== undefined && { mainContent }),
      ...(backgroundImage !== undefined && { backgroundImage }),
      ...(cardContents !== undefined && { cardContents: JSON.stringify(cardContents) }),
      ...(servicesTitle !== undefined && { servicesTitle }),
      ...(servicesList !== undefined && { servicesList: JSON.stringify(servicesList) }),
      ...(whyChooseTitle !== undefined && { whyChooseTitle }),
      ...(whyChoosePoints !== undefined && { whyChoosePoints: JSON.stringify(whyChoosePoints) }),
      ...(footerTitle !== undefined && { footerTitle }),
      ...(footerContent !== undefined && { footerContent }),
      ...(slug !== undefined && { slug }),
      ...(active !== undefined && { active }),
      ...(order !== undefined && { order }),
    };

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    return successResponse(parseServiceData(service), 'Service updated successfully');
  } catch (error) {
    console.error('Error updating service:', error);
    return errorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.service.delete({
      where: { id },
    });

    return successResponse(null, 'Service deleted successfully');
  } catch (error) {
    console.error('Error deleting service:', error);
    return errorResponse(error);
  }
}
