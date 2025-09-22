import type { ISnippet, Language } from '../types';

export class Snippet implements ISnippet {
  id: string;
  title: string;
  code: string;
  language: Language;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    title: string,
    code: string,
    language: Language,
    category: string,
    tags: string[] = []
  ) {
    this.id = `snippet_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.title = title;
    this.code = code;
    this.language = language;
    this.category = category;
    this.tags = tags;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateSnippet(
    title?: string,
    code?: string,
    language?: Language,
    category?: string,
    tags?: string[]
  ): void {
    if (title) this.title = title;
    if (code) this.code = code;
    if (language) this.language = language;
    if (category) this.category = category;
    if (tags) this.tags = tags;
    this.updatedAt = new Date();
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.updatedAt = new Date();
    }
  }
}