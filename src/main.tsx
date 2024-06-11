import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LayoutModeProvider } from './context/LayoutModeContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LayoutModeProvider>
      <App />
    </LayoutModeProvider>
  </React.StrictMode>
);
