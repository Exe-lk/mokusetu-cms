'use client';

import { useState } from 'react';
import Layout from '../components/Layout';

export default function Settings() {
  const [siteName, setSiteName] = useState('MokuSetu CMS');
  const [siteDescription, setSiteDescription] = useState('Business Consultancy Content Management System');
  const [contactEmail, setContactEmail] = useState('contact@mokusetu.com');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <Layout title="Settings">
      <div className="space-y-6 max-w-4xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Site Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Auto-Save</h4>
                <p className="text-sm text-gray-600">Automatically save changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg border border-red-200">
              <div>
                <h4 className="font-semibold text-gray-900">Clear Cache</h4>
                <p className="text-sm text-gray-600">Clear all cached data</p>
              </div>
              <button className="px-4 py-2 bg-white border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
                Clear Cache
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg border border-red-200">
              <div>
                <h4 className="font-semibold text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-600">Download all your content</p>
              </div>
              <button className="px-4 py-2 bg-white border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </Layout>
  );
}

