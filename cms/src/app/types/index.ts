export interface BlogPost {
  id: string;
  title: string;
  author: string;
  status: 'Published' | 'Draft';
  publishedDate: string;
  excerpt?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'inquiry' | 'update' | 'success' | 'info';
}

export interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

export interface HeroSection {
  headline: string;
  subText: string;
  primaryButton: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
  heroImage: string;
}

export interface StatisticsBar {
  title: string;
  items: {
    value: string;
    label: string;
  }[];
}

export interface ContentSection {
  id: string;
  title: string;
  type: 'hero' | 'statistics' | 'services' | 'text';
  content: any;
}

export interface User {
  name: string;
  email: string;
  role: string;
}

