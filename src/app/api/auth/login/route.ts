import { NextRequest } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { successResponse, errorResponse } from '@/src/lib/api-response';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse(new Error('Email and password are required'), 400);
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return errorResponse(new Error('Invalid email or password'), 401);
    }

    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.user_metadata?.name,
          role: 'user',
        },
      });
    }

    if (user.role !== 'admin') {
      return errorResponse(new Error('Access denied. Admin role required.'), 403);
    }

    return successResponse({
      user,
      session: authData.session,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Error during login:', error);
    return errorResponse(error);
  }
}
