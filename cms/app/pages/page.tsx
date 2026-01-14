'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import { contentSections } from '../data/mockData';
import { MdBusiness } from 'react-icons/md';

export default function PageEditor() {
  const [activeSection, setActiveSection] = useState('hero');
  const [heroData, setHeroData] = useState({
    headline: 'Bridging Global Business with Japan',
    subText: 'MokuSetu Group G.K. connects international businesses with opportunities in the Japanese market — from strategy to on-the-ground execution.',
    primaryButtonText: 'Start Your Journey',
    secondaryButtonText: 'Explore Services',
  });

  const [statistics, setStatistics] = useState([
    { value: '3+', label: 'GLOBAL PARTNERS' },
    { value: '15+', label: 'YEARS EXPERIENCE' },
    { value: '98%', label: 'SUCCESS RATE' }
  ]);

  return (
    <Layout title="Page Content Editor - Home">
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pages / Home Page</p>
              <h2 className="text-xl font-bold text-gray-900">Edit Content</h2>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="hidden sm:inline">Live Preview</span>
                <span className="sm:hidden">👁️</span>
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                <span className="hidden sm:inline">Publish Changes</span>
                <span className="sm:hidden">✓</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-green-800 font-medium">AUTO-SAVED</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-bold text-gray-900">Hero Section</h3>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    HEADLINE
                  </label>
                  <input
                    type="text"
                    value={heroData.headline}
                    onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SUB TEXT
                  </label>
                  <textarea
                    value={heroData.subText}
                    onChange={(e) => setHeroData({ ...heroData, subText: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      PRIMARY BUTTON
                    </label>
                    <input
                      type="text"
                      value={heroData.primaryButtonText}
                      onChange={(e) => setHeroData({ ...heroData, primaryButtonText: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SECONDARY BUTTON
                    </label>
                    <input
                      type="text"
                      value={heroData.secondaryButtonText}
                      onChange={(e) => setHeroData({ ...heroData, secondaryButtonText: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    HERO IMAGE
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-red-500 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        <span className="text-red-600 font-semibold">Upload a file</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-bold text-gray-900">Statistics Bar</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">3 items</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-bold text-gray-900">Services Overview</h3>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-bold text-gray-900">Why Choose Us</h3>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-red-500 hover:text-red-600 transition-colors font-medium">
              + Add New Section
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Live Preview</h3>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-red-50 to-orange-50">
                <div className="space-y-3">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {heroData.headline}
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                      {heroData.subText.substring(0, 80)}...
                    </p>
                    <div className="flex gap-2 justify-center">
                      <div className="px-3 py-1 bg-red-600 text-white text-xs rounded">
                        {heroData.primaryButtonText}
                      </div>
                      <div className="px-3 py-1 bg-white border border-gray-300 text-xs rounded">
                        {heroData.secondaryButtonText}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-300">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {statistics.map((stat, index) => (
                        <div key={index}>
                          <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                          <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                   <div className="text-center p-3 bg-white rounded border border-gray-200">
                     <div className="text-xs font-semibold text-gray-700 mb-1">Local Network</div>
                     <div className="w-8 h-8 mx-auto bg-red-100 rounded flex items-center justify-center">
                       <MdBusiness className="text-lg text-red-600" />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

