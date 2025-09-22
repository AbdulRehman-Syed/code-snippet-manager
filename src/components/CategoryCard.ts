import { Category } from '../models/Category';

interface CategoryCardProps {
  category: Category;
  snippetCount: number;
}

export function CategoryCard({ category, snippetCount }: CategoryCardProps) {
  return `
    <div class="category-card" style="border-left: 4px solid ${category.color}">
      <h3>${escapeHtml(category.name)}</h3>
      <p>${escapeHtml(category.description)}</p>
      <div class="category-stats">
        <span>${snippetCount} snippets</span>
      </div>
    </div>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}