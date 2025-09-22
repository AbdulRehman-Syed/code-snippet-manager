import { CategoryCard } from './components/CategoryCard';
import { Notification as NotificationComponent } from './components/Notification';
import { SnippetCard } from './components/SnippetCard';
import { Snippet } from './models/Snippet';
import { SnippetService } from './services/SnippetService';
import type { AppState, Language, Notification } from './types';
import { copyToClipboard } from './utils/helpers';

export class App {
  private snippetService: SnippetService;
  private state: AppState;
  private notifications: Notification[] = [];

  constructor() {
    this.snippetService = new SnippetService();
    this.state = {
      currentView: 'snippets',
      searchQuery: '',
      notifications: []
    };
    this.init();
  }

  private init(): void {
    const categories = this.snippetService.getAllCategories();
    if (categories.length === 0) {
      this.snippetService.createCategory('JavaScript', 'JavaScript code snippets', '#f1c40f');
      this.snippetService.createCategory('TypeScript', 'TypeScript code snippets', '#2980b9');
      this.snippetService.createCategory('Python', 'Python code snippets', '#3498db');
      this.snippetService.createCategory('HTML/CSS', 'Frontend code snippets', '#e74c3c');
      this.snippetService.createCategory('Utilities', 'Utility functions and helpers', '#2ecc71');
    }
    
    this.setupEventListeners();
    this.setupFormSubmission();
    this.render();
  }

  private setupFormSubmission(): void {
    const form = document.getElementById('snippet-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCreateSnippet(e);
      });
    }
  }

  private setupEventListeners(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.matches('#snippets-btn')) {
        this.switchView('snippets');
      } else if (target.matches('#categories-btn')) {
        this.switchView('categories');
      } else if (target.matches('#create-btn')) {
        this.switchView('create');
      }
      
      if (target.matches('.copy-btn')) {
        const id = target.getAttribute('data-id');
        if (id) {
          const snippet = this.snippetService.getSnippetById(id);
          if (snippet) {
            copyToClipboard(snippet.code)
              .then(() => this.addNotification('Code copied to clipboard!', 'success'))
              .catch(() => this.addNotification('Failed to copy code', 'error'));
          }
        }
      }
      
      if (target.matches('.delete-btn')) {
        const id = target.getAttribute('data-id');
        if (id && confirm('Are you sure you want to delete this snippet?')) {
          this.snippetService.deleteSnippet(id);
          this.renderSnippets();
          this.addNotification('Snippet deleted successfully', 'success');
        }
      }
      
      if (target.matches('#export-btn')) {
        this.handleExport();
      }
      
      if (target.matches('#import-btn')) {
        const input = document.getElementById('import-file') as HTMLInputElement;
        input?.click();
      }
      
      if (target.matches('.notification-close')) {
        const id = target.getAttribute('data-id');
        if (id) {
          this.removeNotification(id);
        }
      }
      
      if (target.matches('#create-first-btn')) {
        this.switchView('create');
      }
    });
    
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.state.searchQuery = target.value;
      this.renderSnippets();
    });
    
    const importInput = document.getElementById('import-file') as HTMLInputElement;
    importInput?.addEventListener('change', (e) => {
      this.handleImport(e);
    });
  }

  private switchView(view: 'snippets' | 'categories' | 'create'): void {
    this.state.currentView = view;
    this.render();
  }

  private render(): void {
    this.updateActiveNav();
    
    const snippetsView = document.getElementById('snippets-view');
    const categoriesView = document.getElementById('categories-view');
    const createView = document.getElementById('create-view');
    
    snippetsView?.classList.add('hidden');
    categoriesView?.classList.add('hidden');
    createView?.classList.add('hidden');
    
    switch (this.state.currentView) {
      case 'snippets':
        snippetsView?.classList.remove('hidden');
        this.renderSnippets();
        break;
      case 'categories':
        categoriesView?.classList.remove('hidden');
        this.renderCategories();
        break;
      case 'create':
        createView?.classList.remove('hidden');
        break;
    }
    
    this.renderNotifications();
  }

  private updateActiveNav(): void {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`${this.state.currentView}-btn`);
    activeBtn?.classList.add('active');
  }

  private renderSnippets(): void {
    const container = document.getElementById('snippets-container');
    if (!container) return;
    
    let snippetsToShow: Snippet[];
    
    if (this.state.searchQuery.trim()) {
      snippetsToShow = this.snippetService.searchSnippets(this.state.searchQuery);
    } else {
      snippetsToShow = this.snippetService.getAllSnippets();
    }
    
    if (snippetsToShow.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No snippets found</h3>
          <p>${this.state.searchQuery ? 'Try a different search term' : 'Create your first code snippet to get started!'}</p>
          ${!this.state.searchQuery ? '<button id="create-first-btn" class="btn primary">Create Snippet</button>' : ''}
        </div>
      `;
      return;
    }
    
    const categories = this.snippetService.getAllCategories();
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
    
    container.innerHTML = snippetsToShow.map(snippet => 
      SnippetCard({
        snippet,
        category: categoryMap.get(snippet.category),
        onCopy: () => {},
        onDelete: () => {}
      })
    ).join('');
  }

  private renderCategories(): void {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    const categories = this.snippetService.getAllCategories();
    const snippetCount = this.snippetService.getSnippetCountByCategory();
    
    if (categories.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No categories found</h3>
          <p>Create categories to organize your snippets!</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = `
      <div class="categories-grid">
        ${categories.map(category => 
          CategoryCard({
            category,
            snippetCount: snippetCount[category.id] || 0
          })
        ).join('')}
      </div>
    `;
  }

  private handleCreateSnippet(e: Event): void {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const actualForm = form.tagName === 'FORM' ? form : form.closest('form') as HTMLFormElement;
    if (!actualForm) {
      this.addNotification('Form not found', 'error');
      return;
    }
    
    const formData = new FormData(actualForm);
    
    const title = formData.get('title') as string;
    const code = formData.get('code') as string;
    const language = formData.get('language') as string as Language;
    const category = formData.get('category') as string;
    const tagsInput = formData.get('tags') as string;
    
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    if (!title || !code || !language || !category) {
      this.addNotification('Please fill in all required fields', 'error');
      return;
    }
    
    try {
      this.snippetService.createSnippet(title, code, language, category, tags);
      this.addNotification('Snippet created successfully!', 'success');
      actualForm.reset();
      this.switchView('snippets');
    } catch (error) {
      this.addNotification('Failed to create snippet', 'error');
    }
  }

  private handleExport(): void {
    const data = this.snippetService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-snippets-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    this.addNotification('Data exported successfully!', 'success');
  }

  private handleImport(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result as string;
        if (this.snippetService.importData(data)) {
          this.addNotification('Data imported successfully!', 'success');
          this.renderSnippets();
          this.renderCategories();
        } else {
          this.addNotification('Invalid data format', 'error');
        }
      } catch (error) {
        this.addNotification('Failed to import data', 'error');
      }
    };
    
    reader.readAsText(file);
    input.value = '';
  }

  private addNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const notification: Notification = {
      id: `notification_${Date.now()}`,
      message,
      type,
      timestamp: new Date()
    };
    
    this.notifications.push(notification);
    this.renderNotifications();
  }

  private removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.renderNotifications();
  }

  private renderNotifications(): void {
    const container = document.getElementById('notifications-container');
    if (!container) return;
    
    if (this.notifications.length === 0) {
      container.innerHTML = '';
      return;
    }
    
    container.innerHTML = this.notifications.map(notification => 
      NotificationComponent({
        notification,
        onRemove: (id) => this.removeNotification(id)
      })
    ).join('');
  }
}