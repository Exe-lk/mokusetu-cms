import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { createdResponse, errorResponse } from '@/lib/api-response';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password) {
      return errorResponse(new Error('Email and password are required'), 400);
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      },
    });

    if (authError || !authData.user) {
      return errorResponse(new Error(authError?.message || 'Registration failed'), 400);
    }

    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        name,
        role: role || 'user',
      },
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

    return createdResponse({
      user,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return errorResponse(error);
  }
}
