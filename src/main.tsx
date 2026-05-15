import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyThemeClass } from './hooks/useTheme'

const stored = localStorage.getItem('catalog-theme') as 'light' | 'dark' | null
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
applyThemeClass(stored ?? (prefersLight ? 'light' : 'dark'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
