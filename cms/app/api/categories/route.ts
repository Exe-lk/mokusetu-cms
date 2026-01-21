import { NextRequest } from 'next/server';
import{ prisma } from '@/lib/prisma';
import { successResponse, createdResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return successResponse({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    if (!name) {
      return errorResponse(new Error('Name is required'), 400);
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
      },
    });

    return createdResponse(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return errorResponse(error);
  }
}
