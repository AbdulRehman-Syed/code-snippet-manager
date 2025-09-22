import { Category } from '../models/Category';
import { Snippet } from '../models/Snippet';
import type { Language } from '../types';
import { StorageService } from './StorageService';

export class SnippetService {
  private snippets: Snippet[] = [];
  private categories: Category[] = [];

  constructor() {
    console.log('SnippetService constructor called');
    this.loadFromStorage();
    console.log('SnippetService initialized with', this.snippets.length, 'snippets');
  }

  private loadFromStorage(): void {
    console.log('Loading from storage...');
    try {
      const storedSnippets = StorageService.loadSnippets();
      console.log('Loaded snippets from storage:', storedSnippets.length);
      
      this.snippets = storedSnippets.map((snippet: any) => {
        const newSnippet = new Snippet(
          snippet.title,
          snippet.code,
          snippet.language,
          snippet.category,
          snippet.tags
        );
        newSnippet.id = snippet.id;
        newSnippet.createdAt = new Date(snippet.createdAt);
        newSnippet.updatedAt = new Date(snippet.updatedAt);
        return newSnippet;
      });

      const storedCategories = StorageService.loadCategories();
      console.log('Loaded categories from storage:', storedCategories.length);
      
      this.categories = storedCategories.map((category: any) => {
        const newCategory = new Category(
          category.name,
          category.description,
          category.color
        );
        newCategory.id = category.id;
        return newCategory;
      });
      
      console.log('Storage loading complete. Snippets:', this.snippets.length, 'Categories:', this.categories.length);
    } catch (error) {
      console.error('Error loading data from storage:', error);
      this.snippets = [];
      this.categories = [];
    }
  }

  private saveToStorage(): void {
    console.log('Saving to storage. Snippets:', this.snippets.length, 'Categories:', this.categories.length);
    StorageService.saveSnippets(this.snippets);
    StorageService.saveCategories(this.categories);
  }

  createSnippet(
    title: string,
    code: string,
    language: Language,
    category: string,
    tags: string[] = []
  ): Snippet {
    console.log('Creating new snippet:', { title, language, category, tagsLength: tags.length });
    const snippet = new Snippet(title, code, language, category, tags);
    this.snippets.push(snippet);
    console.log('Snippet created with ID:', snippet.id, 'Total snippets now:', this.snippets.length);
    this.saveToStorage();
    return snippet;
  }

  getAllSnippets(): Snippet[] {
    console.log('Getting all snippets, count:', this.snippets.length);
    return [...this.snippets];
  }

  getSnippetById(id: string): Snippet | undefined {
    return this.snippets.find(snippet => snippet.id === id);
  }

  updateSnippet(
    id: string,
    title?: string,
    code?: string,
    language?: Language,
    category?: string,
    tags?: string[]
  ): boolean {
    const snippet = this.getSnippetById(id);
    if (snippet) {
      snippet.updateSnippet(title, code, language, category, tags);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteSnippet(id: string): boolean {
    const index = this.snippets.findIndex(snippet => snippet.id === id);
    if (index !== -1) {
      this.snippets.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  searchSnippets(query: string): Snippet[] {
    const lowerQuery = query.toLowerCase();
    return this.snippets.filter(snippet =>
      snippet.title.toLowerCase().includes(lowerQuery) ||
      snippet.code.toLowerCase().includes(lowerQuery) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  filterByCategory(category: string): Snippet[] {
    return this.snippets.filter(snippet => snippet.category === category);
  }

  filterByLanguage(language: Language): Snippet[] {
    return this.snippets.filter(snippet => snippet.language === language);
  }

  getAllTags(): string[] {
    const allTags = this.snippets.flatMap(snippet => snippet.tags);
    return [...new Set(allTags)];
  }

  getSnippetsByTag(tag: string): Snippet[] {
    return this.snippets.filter(snippet => snippet.tags.includes(tag));
  }

  createCategory(name: string, description: string, color: string = '#3498db'): Category {
    const category = new Category(name, description, color);
    this.categories.push(category);
    this.saveToStorage();
    return category;
  }

  getAllCategories(): Category[] {
    return [...this.categories];
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find(category => category.id === id);
  }

  updateCategory(
    id: string,
    name?: string,
    description?: string,
    color?: string
  ): boolean {
    const category = this.getCategoryById(id);
    if (category) {
      category.updateCategory(name, description, color);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteCategory(id: string): boolean {
    const index = this.categories.findIndex(category => category.id === id);
    if (index !== -1) {
      this.categories.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getSnippetCountByCategory(): Record<string, number> {
    const count: Record<string, number> = {};
    this.snippets.forEach(snippet => {
      count[snippet.category] = (count[snippet.category] || 0) + 1;
    });
    return count;
  }

  exportData(): string {
    return JSON.stringify({
      snippets: this.snippets,
      categories: this.categories
    }, null, 2);
  }

  importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.snippets && parsed.categories) {
        this.snippets = parsed.snippets.map((s: any) => {
          const snippet = new Snippet(s.title, s.code, s.language, s.category, s.tags);
          snippet.id = s.id;
          snippet.createdAt = new Date(s.createdAt);
          snippet.updatedAt = new Date(s.updatedAt);
          return snippet;
        });
        
        this.categories = parsed.categories.map((c: any) => {
          const category = new Category(c.name, c.description, c.color);
          category.id = c.id;
          return category;
        });
        
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing ', error);
      return false;
    }
  }
}