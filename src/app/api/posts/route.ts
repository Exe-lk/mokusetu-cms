import { NextRequest } from 'next/server';
import{ prisma } from '@/src/lib/prisma';
import { successResponse, createdResponse, errorResponse } from '@/src/lib/api-response';
import { generateSlug } from '@/src/lib/slug-utils';

export async function GET(request: NextRequest) { 
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published');
    const categoryId = searchParams.get('categoryId');
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (published !== null) {
      where.published = published === 'true';
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    return successResponse({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return errorResponse(error);
  }
}

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, featuredImage, published, categoryId } = body;

    if (!title) {
      return errorResponse(new Error('Title is required'), 400);
    }

    const postSlug = slug || generateSlug(title);
    
    if (!postSlug || postSlug.trim() === '') {
      return errorResponse(new Error('Unable to generate a valid slug from title'), 400);
    }

    let finalCategoryId: string | undefined = undefined;
    
    if (published) {
      const publishDate = new Date();
      finalCategoryId = await getOrCreateYearMonthCategory(publishDate);
    } else if (categoryId && typeof categoryId === 'string' && categoryId.trim() !== '') {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return errorResponse(new Error(`Category with id ${categoryId} does not exist`), 404);
      }
      finalCategoryId = categoryId;
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: postSlug,
        content,
        excerpt,
        featuredImage,
        published: published || false,
        publishedAt: published ? new Date() : null,
        ...(finalCategoryId && { categoryId: finalCategoryId }),
      },
      include: {
        category: true,
      },
    });

    return createdResponse(post);
  } catch (error: any) {
    console.error('Error creating post:', error);
    
    if (error?.code === 'P2003') {
      const fieldName = error?.meta?.field_name || 'foreign key';
      return errorResponse(
        new Error(`Foreign key constraint violation: ${fieldName} does not exist`),
        400
      );
    }
    
    if (error?.code === 'P2002') {
      const field = error?.meta?.target?.[0] || 'field';
      return errorResponse(
        new Error(`A post with this ${field} already exists`),
        409
      );
    }
    
    return errorResponse(error);
  }
}
