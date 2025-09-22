export interface ISnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'html' | 'css' | 'other';

export interface AppState {
  currentView: 'snippets' | 'categories' | 'create';
  searchQuery: string;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: Date;
}