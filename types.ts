export enum Category {
  ALL = 'all',
  LITERATURE = 'literature',
  MUSIC = 'music',
  ARCHITECTURE = 'architecture'
}

export interface Exhibit {
  id: string;
  title: string;
  description: string;
  category: Category;
  subcategory?: string; // New field for subcategories like 'Novel', 'Museum', 'Classical'
  imageUrl: string;
  details?: string; // Additional info like Author, Architect, Composer, Location
  year?: string;
  tags: string[];
  audioUrl?: string; // URL for music preview
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  gradient: string;
}