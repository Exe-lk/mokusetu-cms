import apiClient from '@/src/lib/api-client';

export interface HomeThreeCard {
  cardIcon: string;
  cardTitle: string;
  cardContent: string;
}

export interface HomeWhyChooseCard {
  cardIcon: string;
  cardTitle: string;
  cardContent: string;
}

export interface HomeServiceCard {
  cardIcon: string;
  selectedService: string; 
  content: string;
}

export interface HomePage {
  id: string;
  titleHero: string | null;
  contentHero: string | null;
  globalPartners: string | null;
  yearsExperiences: string | null;
  successRate: string | null;
  aboutTitle: string | null;
  aboutContent: string | null;
  serviceIcon: string | null;
  serviceServiceId: string | null;
  serviceTitle: string | null;
  serviceContent: string | null;
  serviceCards: HomeServiceCard[];
  threeCards: HomeThreeCard[];
  whyChooseTitle: string | null;
  whyChooseSubtitle: string | null;
  whyChooseCards: HomeWhyChooseCard[];
  footerTitle: string | null;
  footerSubtitle: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateHomePageDto {
  titleHero?: string | null;
  contentHero?: string | null;
  globalPartners?: string | null;
  yearsExperiences?: string | null;
  successRate?: string | null;
  aboutTitle?: string | null;
  aboutContent?: string | null;
  serviceIcon?: string | null;
  serviceServiceId?: string | null;
  serviceTitle?: string | null;
  serviceContent?: string | null;
  serviceCards?: HomeServiceCard[];
  threeCards?: HomeThreeCard[];
  whyChooseTitle?: string | null;
  whyChooseSubtitle?: string | null;
  whyChooseCards?: HomeWhyChooseCard[];
  footerTitle?: string | null;
  footerSubtitle?: string | null;
}

export const homeService = {
  async getHomePage() {
    return apiClient.get('/home');
  },

  async updateHomePage(data: UpdateHomePageDto) {
    return apiClient.put('/home', data);
  },
};

