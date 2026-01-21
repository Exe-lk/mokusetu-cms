import { NextRequest } from 'next/server';
import {prisma } from '@/lib/prisma';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        posts: true,
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!category) {
      return notFoundResponse('Category');
    }

    return successResponse(category);
  } catch (error) {
    console.error('Error fetching category:', error);
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
    const { name, slug, description } = body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
      },
    });

    return successResponse(category, 'Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
    return errorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.category.delete({
      where: { id },
    });

    return successResponse(null, 'Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error);
    return errorResponse(error);
  }
}
