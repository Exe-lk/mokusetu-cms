import { NextRequest } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { successResponse, createdResponse, errorResponse } from '@/src/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    const where: any = {};
    
    if (published !== null) {
      where.published = published === 'true';
    }

    const pages = await prisma.page.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return successResponse({ pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, published, authorId } = body;

    if (!title || !authorId) {
      return errorResponse(new Error('Title and authorId are required'), 400);
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        content,
        published: published || false,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return createdResponse(page);
  } catch (error) {
    console.error('Error creating page:', error);
    return errorResponse(error);
  }
}
