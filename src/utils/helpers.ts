export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getRandomColor(): string {
  const colors = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12',
    '#9b59b6', '#1abc9c', '#34495e', '#e67e22'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function highlightCode(code: string, language: string): string {
  const keywords: Record<string, string[]> = {
    javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'return', 'for', 'while'],
    typescript: ['interface', 'type', 'class', 'public', 'private', 'protected', 'extends', 'implements'],
    python: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif', 'for', 'while'],
    java: ['public', 'private', 'class', 'interface', 'extends', 'implements', 'return', 'if', 'else']
  };

  let highlighted = code;
  const langKeywords = keywords[language] || [];

  langKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="keyword">$1</span>`);
  });

  highlighted = highlighted.replace(/(".*?"|'.*?')/g, `<span class="string">$1</span>`);

  if (language === 'python') {
    highlighted = highlighted.replace(/(#.*)/g, `<span class="comment">$1</span>`);
  } else {
    highlighted = highlighted.replace(/(\/\/.*)/g, `<span class="comment">$1</span>`);
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, `<span class="comment">$1</span>`);
  }

  return highlighted;
}