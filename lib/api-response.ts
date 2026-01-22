import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status: 200 }
  );
}

export function createdResponse<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message: message || 'Resource created successfully',
    },
    { status: 201 }
  );
}

export function errorResponse(error: unknown, statusCode = 500) {
  const message = error instanceof Error ? error.message : 'Internal Server Error';
  
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: statusCode }
  );
}

export function notFoundResponse(resource = 'Resource') {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: `${resource} not found`,
    },
    { status: 404 }
  );
}

export function badRequestResponse(message: string) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: 400 }
  );
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: 401 }
  );
}
