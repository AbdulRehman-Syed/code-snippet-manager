import type { ICategory } from '../types';

export class Category implements ICategory {
  id: string;
  name: string;
  description: string;
  color: string;

  constructor(name: string, description: string, color: string = '#3498db') {
    this.id = `category_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.name = name;
    this.description = description;
    this.color = color;
  }

  updateCategory(name?: string, description?: string, color?: string): void {
    if (name) this.name = name;
    if (description) this.description = description;
    if (color) this.color = color;
  }
}