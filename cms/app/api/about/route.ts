import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    let aboutPage = await prisma.aboutPage.findFirst();

    if (!aboutPage) {
      aboutPage = await prisma.aboutPage.create({
        data: {
          pageTitle: 'About Us',
          pageSubtitle: 'Your trusted partner in bridging global business with Japan\'s dynamic market.',
          active: true,
        },
      });
    }

    const parseJsonField = <T = any>(value: string | null): T | [] => {
      if (!value) return [];
      try {
        return JSON.parse(value) as T;
      } catch (err) {
        console.error('Failed to parse JSON field on AboutPage:', err);
        return [];
      }
    };

    const parsedAboutPage = {
      ...aboutPage,
      storySections: parseJsonField(aboutPage.storySections),
      coreValues: parseJsonField(aboutPage.coreValues),
      timeline: parseJsonField(aboutPage.timeline),
    };

    return successResponse(parsedAboutPage);
  } catch (error: any) {
    console.error('Error fetching about page:', error);
    return errorResponse(error, 500);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    let aboutPage = await prisma.aboutPage.findFirst();

    const data: any = {
      ...body,
    };

    if (body.storySections) {
      data.storySections = JSON.stringify(body.storySections);
    }
    if (body.coreValues) {
      data.coreValues = JSON.stringify(body.coreValues);
    }
    if (body.timeline) {
      data.timeline = JSON.stringify(body.timeline);
    }

    if (aboutPage) {
      aboutPage = await prisma.aboutPage.update({
        where: { id: aboutPage.id },
        data,
      });
    } else {
      aboutPage = await prisma.aboutPage.create({
        data,
      });
    }

    const parseJsonField = <T = any>(value: string | null): T | [] => {
      if (!value) return [];
      try {
        return JSON.parse(value) as T;
      } catch (err) {
        console.error('Failed to parse JSON field on AboutPage (PUT):', err);
        return [];
      }
    };

    const parsedAboutPage = {
      ...aboutPage,
      storySections: parseJsonField(aboutPage.storySections),
      coreValues: parseJsonField(aboutPage.coreValues),
      timeline: parseJsonField(aboutPage.timeline),
    };

    return successResponse(parsedAboutPage);
  } catch (error: any) {
    console.error('Error updating about page:', error);
    return errorResponse(error, 500);
  }
}
