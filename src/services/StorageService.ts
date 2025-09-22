export class StorageService {
  private static readonly SNIPPETS_KEY = 'code_snippets';
  private static readonly CATEGORIES_KEY = 'code_categories';

  static save<T>(key: string,  data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage: ${error}`);
    }
  }

  static load<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading from localStorage: ${error}`);
      return [];
    }
  }

  static saveSnippets(snippets: any[]): void {
    this.save(this.SNIPPETS_KEY, snippets);
  }

  static loadSnippets(): any[] {
    return this.load(this.SNIPPETS_KEY);
  }

  static saveCategories(categories: any[]): void {
    this.save(this.CATEGORIES_KEY, categories);
  }

  static loadCategories(): any[] {
    return this.load(this.CATEGORIES_KEY);
  }

  static clearAll(): void {
    localStorage.removeItem(this.SNIPPETS_KEY);
    localStorage.removeItem(this.CATEGORIES_KEY);
  }
}