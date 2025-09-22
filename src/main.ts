import { App } from './App';
import './style.css';

console.log('main.ts loaded');

function initializeApp() {
  console.log('Attempting to initialize app');
  
  if (typeof document === 'undefined') {
    console.log('Not in browser environment');
    return;
  }
  
  const requiredElements = [
    'snippets-container',
    'categories-container', 
    'notifications-container'
  ];
  
  const allElementsExist = requiredElements.every(id => {
    const elementExists = document.getElementById(id) !== null;
    console.log(`Element ${id} exists: ${elementExists}`);
    return elementExists;
  });
  
  if (allElementsExist) {
    console.log('All required elements found, initializing App');
    new App();
  } else {
    console.warn('Required DOM elements not found. Retrying in 100ms...');
    setTimeout(initializeApp, 100);
  }
}

if (document.readyState === 'loading') {
  console.log('DOM still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  console.log('DOM already loaded, initializing immediately');
  initializeApp();
}