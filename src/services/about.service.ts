import apiClient from '@/src/lib/api-client';

export interface StorySection {
  title: string;
  content: string;
  image?: string;
}

export interface CoreValue {
  title: string;
  description: string;
  icon: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface AboutPage {
  id: string;
  backgroundImage?: string;
  pageTitle: string;
  pageSubtitle?: string;
  storySections?: StorySection[];
  missionSectionTitle?: string;
  missionSectionSubtitle?: string;
  missionTitle?: string;
  missionContent?: string;
  missionIcon?: string;
  visionTitle?: string;
  visionContent?: string;
  visionIcon?: string;
  brandArchetypeTitle?: string;
  brandArchetype?: string;
  coreValuesSectionTitle?: string;
  coreValuesSectionSubtitle?: string;
  coreValues?: CoreValue[];
  timelineSectionTitle?: string;
  timelineSectionSubtitle?: string;
  timeline?: TimelineItem[];
  ctaTitle?: string;
  ctaContent?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateAboutPageDto {
  backgroundImage?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  storySections?: StorySection[];
  missionSectionTitle?: string;
  missionSectionSubtitle?: string;
  missionTitle?: string;
  missionContent?: string;
  missionIcon?: string;
  visionTitle?: string;
  visionContent?: string;
  visionIcon?: string;
  brandArchetypeTitle?: string;
  brandArchetype?: string;
  coreValuesSectionTitle?: string;
  coreValuesSectionSubtitle?: string;
  coreValues?: CoreValue[];
  timelineSectionTitle?: string;
  timelineSectionSubtitle?: string;
  timeline?: TimelineItem[];
  ctaTitle?: string;
  ctaContent?: string;
  active?: boolean;
}

export const aboutService = {
  async getAboutPage() {
    return apiClient.get('/about');
  },

  async updateAboutPage(data: UpdateAboutPageDto) {
    return apiClient.put('/about', data);
  },

  async initializeAboutPage() {
    return apiClient.post('/about/initialize');
  },
};
