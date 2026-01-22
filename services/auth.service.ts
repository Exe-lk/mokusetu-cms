import apiClient from '@/lib/api-client';
import { createClient } from '@supabase/supabase-js';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authService = {
  async login(data: LoginDto) {
    return apiClient.post('/auth/login', data);
  },

  async register(data: RegisterDto) {
    return apiClient.post('/auth/register', data);
  },

  storeUser(user: AuthUser, session?: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      if (session) {
        localStorage.setItem('session', JSON.stringify(session));
      }
    }
  },

  getStoredUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  getStoredSession(): any | null {
    if (typeof window !== 'undefined') {
      const sessionStr = localStorage.getItem('session');
      return sessionStr ? JSON.parse(sessionStr) : null;
    }
    return null;
  },

  isAuthenticated(): boolean {
    return this.getStoredUser() !== null && this.getStoredSession() !== null;
  },

  isAdmin(): boolean {
    const user = this.getStoredUser();
    return user?.role === 'admin';
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('session');
      await supabase.auth.signOut();
    }
  },
};
