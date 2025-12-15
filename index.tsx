import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';

// Polyfill para process.env em ambientes de navegador (evita "process is not defined")
if (typeof window !== 'undefined' && !(window as any).process) {
    (window as any).process = { env: {} };
}

// Mapeia VITE_API_KEY para process.env.API_KEY se estiver disponível
// Isso permite que a API funcione corretamente com variáveis de ambiente do Vite
try {
    // @ts-ignore
    if (import.meta.env && import.meta.env.VITE_API_KEY) {
        // @ts-ignore
        (window as any).process.env.API_KEY = import.meta.env.VITE_API_KEY;
    }
} catch (e) {
    // Silently ignore if import.meta is not supported
    console.warn("Ambiente não suporta import.meta ou VITE_API_KEY não encontrada.");
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
        <App />
    </LanguageProvider>
  </React.StrictMode>
);