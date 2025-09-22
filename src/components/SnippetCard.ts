import { Category } from '../models/Category';
import { Snippet } from '../models/Snippet';
import { formatDate, highlightCode } from '../utils/helpers';

interface SnippetCardProps {
  snippet: Snippet;
  category?: Category;
  onCopy: (code: string) => void;
  onDelete: (id: string) => void;
}

export function SnippetCard({ snippet, category, onCopy: _, onDelete: __ }: SnippetCardProps) {
  const categoryColor = category?.color || '#3498db';
  
  return `
    <div class="snippet-card" data-id="${snippet.id}">
      <div class="snippet-header">
        <h3>${escapeHtml(snippet.title)}</h3>
        <div class="snippet-meta">
          <span class="language-badge ${snippet.language}">${snippet.language}</span>
          <span class="category-badge" style="background-color: ${categoryColor}">
            ${category?.name || snippet.category}
          </span>
        </div>
      </div>
      <pre class="snippet-code"><code>${highlightCode(escapeHtml(snippet.code), snippet.language)}</code></pre>
      <div class="snippet-footer">
        <div class="tags">
          ${snippet.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="actions">
          <button class="btn small copy-btn" data-id="${snippet.id}">Copy</button>
          <button class="btn small delete-btn" data-id="${snippet.id}">Delete</button>
        </div>
      </div>
      <div class="snippet-date">
        Created: ${formatDate(snippet.createdAt)}
      </div>
    </div>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}