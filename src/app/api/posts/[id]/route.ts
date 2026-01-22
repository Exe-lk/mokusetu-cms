import { NextRequest } from 'next/server';
import{ prisma } from '@/src/lib/prisma';
import { successResponse, errorResponse, notFoundResponse } from '@/src/lib/api-response';
import { generateSlug } from '@/src/lib/slug-utils';

async function getOrCreateYearMonthCategory(publishDate: Date): Promise<string> {
  const year = publishDate.getFullYear();
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const categoryName = `${year}-${month}`;
  const categorySlug = categoryName.toLowerCase();

  let category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[publishDate.getMonth()];
    const description = `${monthName} ${year}`;
    
    category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: categorySlug,
        description: description,
      },
    });
  }

  return category.id;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!post) {
      return notFoundResponse('Post');
    }

    return successResponse(post);
  } catch (error) {
    console.error('Error fetching post:', error);
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
    const { title, slug, content, excerpt, featuredImage, published, categoryId } = body;

    const currentPost = await prisma.post.findUnique({
      where: { id },
      select: { published: true, publishedAt: true, title: true },
    });

    const updateData: any = {
      ...(title && { title }),
      // Auto-generate slug if title changed and slug not provided
      ...(title && !slug && currentPost && title !== currentPost.title && { slug: generateSlug(title) }),
      ...(slug && { slug }),
      ...(content !== undefined && { content }),
      ...(excerpt !== undefined && { excerpt }),
      ...(featuredImage !== undefined && { featuredImage }),
    };

    if (published !== undefined) {
      const publishDate = new Date();
      updateData.published = published;
      updateData.publishedAt = published ? publishDate : null;

      if (published) {
        const yearMonthCategoryId = await getOrCreateYearMonthCategory(publishDate);
        updateData.categoryId = yearMonthCategoryId;
      } else if (categoryId !== undefined) {
        if (categoryId && typeof categoryId === 'string' && categoryId.trim() !== '') {
          const category = await prisma.category.findUnique({
            where: { id: categoryId },
          });
          if (category) {
            updateData.categoryId = categoryId;
          }
        } else {
          updateData.categoryId = null;
        }
      }
    } else if (categoryId !== undefined) {
      if (categoryId && typeof categoryId === 'string' && categoryId.trim() !== '') {
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });
        if (category) {
          updateData.categoryId = categoryId;
        }
      } else {
        updateData.categoryId = null;
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return successResponse(post, 'Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
    return errorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.post.delete({
      where: { id },
    });

    return successResponse(null, 'Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    return errorResponse(error);
  }
}
