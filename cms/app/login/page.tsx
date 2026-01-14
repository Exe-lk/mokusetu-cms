'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdDashboard, MdEdit } from 'react-icons/md';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#1e293b] to-[#334155] p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6">
              <span className="text-[#1e293b] font-bold text-3xl">M</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">MokuSetu Admin</h1>
            <p className="text-xl text-gray-300 mb-8">Business Consultancy CMS</p>
            
            <div className="space-y-4 mt-12">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <MdDashboard className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold">Dashboard Analytics</h3>
                  <p className="text-sm text-gray-300">Track your site performance</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <MdEdit className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold">Content Management</h3>
                  <p className="text-sm text-gray-300">Easy blog & page editing</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full"></div>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">MokuSetu</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Please enter your credentials to manage your content.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <svg 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <svg 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Keep me logged in</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-700 font-medium">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
            >
              <span>Login to Dashboard</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              © 2025 MokuSetu Group G.K. All rights reserved.
            </p>
            <div className="mt-2">
              <Link href="/support" className="text-sm text-gray-600 hover:text-red-600">
                Need assistance? <span className="font-semibold">Contact IT Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

