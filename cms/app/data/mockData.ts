import { BlogPost, Activity, StatCard, HeroSection, StatisticsBar, ContentSection } from '../types';
import { MdVisibility, MdArticle, MdEmail } from 'react-icons/md';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Story Behind Our Name – MokuSetu',
    author: 'Takashi M.',
    status: 'Published',
    publishedDate: 'Sep 30, 2025',
    excerpt: 'Discover the meaning and inspiration behind our company name.'
  },
  {
    id: '2',
    title: 'Japan set to unveil a 10-trillion-yen investment plan',
    author: 'Akane',
    status: 'Published',
    publishedDate: 'Sep 28, 2025',
    excerpt: 'Breaking down Japan\'s massive economic initiative.'
  },
  {
    id: '3',
    title: 'Cross-Border Cultural Fluency in Modern Trade',
    author: 'Kara Saitou',
    status: 'Draft',
    publishedDate: 'Oct 02, 2025',
    excerpt: 'Understanding cultural nuances in international business.'
  },
  {
    id: '4',
    title: 'Bridge Between Global Markets and Local Expertise',
    author: 'Takashi M.',
    status: 'Published',
    publishedDate: 'Sep 20, 2025',
    excerpt: 'How we connect international opportunities with local insights.'
  }
];

export const recentActivities: Activity[] = [
  {
    id: '1',
    title: 'New inquiry received',
    description: 'Contact request from Logistics Solutions Inc.',
    time: '2 HOURS AGO',
    type: 'inquiry'
  },
  {
    id: '2',
    title: 'Service page updated',
    description: 'Service updated: Quality Inspection details.',
    time: '5 HOURS AGO',
    type: 'update'
  },
  {
    id: '3',
    title: 'Backup completed',
    description: 'Weekly system backup finished successfully.',
    time: 'YESTERDAY',
    type: 'success'
  }
];

export const dashboardStats: StatCard[] = [
  {
    title: 'Total Page Views',
    value: '24,592',
    change: '+19.5%',
    changeType: 'positive',
    icon: <MdVisibility />,
    color: 'blue'
  },
  {
    title: 'Published Posts',
    value: 128,
    change: 'No change',
    changeType: 'neutral',
    icon: <MdArticle />,
    color: 'red'
  },
  {
    title: 'Pending Inquiries',
    value: 14,
    change: '4 New',
    changeType: 'neutral',
    icon: <MdEmail />,
    color: 'orange'
  }
];

export const heroSectionData: HeroSection = {
  headline: 'Bridging Global Business with Japan',
  subText: 'MokuSetu Group G.K. connects international businesses with opportunities in the Japanese market — from strategy to on-the-ground execution.',
  primaryButton: {
    text: 'Start Your Journey',
    link: '#'
  },
  secondaryButton: {
    text: 'Explore Services',
    link: '#'
  },
  heroImage: '/placeholder-hero.jpg'
};

export const statisticsData: StatisticsBar = {
  title: 'Statistics Bar',
  items: [
    { value: '3+', label: 'GLOBAL PARTNERS' },
    { value: '15+', label: 'YEARS EXPERIENCE' },
    { value: '98%', label: 'SUCCESS RATE' }
  ]
};

export const contentSections: ContentSection[] = [
  {
    id: 'hero',
    title: 'Hero Section',
    type: 'hero',
    content: heroSectionData
  },
  {
    id: 'statistics',
    title: 'Statistics Bar',
    type: 'statistics',
    content: statisticsData
  },
  {
    id: 'services',
    title: 'Services Overview',
    type: 'services',
    content: {
      title: 'Our Services',
      description: 'Comprehensive business solutions for the Japanese market'
    }
  },
  {
    id: 'why-choose',
    title: 'Why Choose Us',
    type: 'text',
    content: {
      title: 'Why Choose Us',
      description: 'Expert guidance and local knowledge'
    }
  }
];

export const currentUser = {
  name: 'Admin',
  email: 'admin@mokusetu.com',
  role: 'Super Admin'
};

