import apiClient from '@/src/lib/api-client';

export interface CardContent {
  header: string;
  content: string;
  icon: string;
}

export interface ServiceItem {
  title: string;
  points: string[];
}

export interface WhyChoosePoint {
  title: string;
  icon?: string;
  subPoints: string[];
}

export interface Service {
  id: string;
  backgroundImage?: string;
  pageTitle: string;
  pageSubtitle?: string;
  listImage?: string;
  summary?: string;
  mainContent: string;
  cardContents?: CardContent[];
  servicesTitle?: string;
  servicesList?: ServiceItem[];
  whyChooseTitle?: string;
  whyChoosePoints?: WhyChoosePoint[];
  footerTitle?: string;
  footerContent?: string;
  slug: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceDto {
  backgroundImage?: string;
  pageTitle: string;
  pageSubtitle?: string;
  listImage?: string;
  summary?: string;
  mainContent: string;
  cardContents?: CardContent[];
  servicesTitle?: string;
  servicesList?: ServiceItem[];
  whyChooseTitle?: string;
  whyChoosePoints?: WhyChoosePoint[];
  footerTitle?: string;
  footerContent?: string;
  slug?: string;
  active?: boolean;
  order?: number;
}

export interface UpdateServiceDto {
  backgroundImage?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  listImage?: string;
  summary?: string;
  mainContent?: string;
  cardContents?: CardContent[];
  servicesTitle?: string;
  servicesList?: ServiceItem[];
  whyChooseTitle?: string;
  whyChoosePoints?: WhyChoosePoint[];
  footerTitle?: string;
  footerContent?: string;
  slug?: string;
  active?: boolean;
  order?: number;
}

export const servicesService = {
  async getServices(active?: boolean) {
    const params = active !== undefined ? { active: active.toString() } : undefined;
    return apiClient.get('/services', params);
  },

  async getService(id: string) {
    return apiClient.get(`/services/${id}`);
  },

  async getServiceBySlug(slug: string) {
    return apiClient.get(`/services/slug/${slug}`);
  },

  async createService(data: CreateServiceDto) {
    return apiClient.post('/services', data);
  },

  async updateService(id: string, data: UpdateServiceDto) {
    return apiClient.put(`/services/${id}`, data);
  },

  async deleteService(id: string) {
    return apiClient.delete(`/services/${id}`);
  },
};
