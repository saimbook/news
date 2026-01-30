
export enum CategoryType {
  LATEST = 'সর্বশেষ',
  NATIONAL = 'জাতীয়',
  POLITICS = 'রাজনীতি',
  ECONOMY = 'অর্থনীতি',
  INTERNATIONAL = 'আন্তর্জাতিক',
  SPORTS = 'খেলা',
  ENTERTAINMENT = 'বিনোদন',
  TECH = 'প্রযুক্তি',
  HEALTH = 'স্বাস্থ্য',
  EDUCATION = 'শিক্ষা',
  LIFESTYLE = 'লাইফস্টাইল'
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: CategoryType;
  image: string;
  author: string;
  publishDate: string;
  isLead?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  readingTime?: number;
}

export interface Comment {
  id: string;
  articleId: string;
  userName: string;
  text: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Editor' | 'Reporter' | 'Moderator' | 'SEO Manager';
}
