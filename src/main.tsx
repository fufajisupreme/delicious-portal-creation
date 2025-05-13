
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Immediately apply the theme preference on page load to avoid flicker
const setInitialTheme = () => {
  const theme = localStorage.getItem('vite-ui-theme') || 'system';
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
    document.documentElement.classList.add(systemTheme);
  } else {
    document.documentElement.classList.add(theme);
  }
};

// Execute immediately before React loads
setInitialTheme();

createRoot(document.getElementById("root")!).render(<App />);
