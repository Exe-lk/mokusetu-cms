import apiClient from '@/lib/api-client';

export interface Setting {
  id: string;
  key: string;
  value?: string;
  type: string;
  updatedAt: Date;
}

export interface CreateSettingDto {
  key: string;
  value: any;
  type?: 'text' | 'json' | 'boolean' | 'number';
}

export const settingsService = {
  async getSettings() {
    return apiClient.get('/settings');
  },

  async setSetting(data: CreateSettingDto) {
    return apiClient.post('/settings', data);
  },
};
