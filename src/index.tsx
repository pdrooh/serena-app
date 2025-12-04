import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA (only in production)
// In development, unregister any existing service workers to avoid conflicts
if ('serviceWorker' in navigator) {
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('SW registered successfully: ', registration);
        })
        .catch((registrationError) => {
          console.warn('SW registration failed: ', registrationError);
        });
    });
  } else {
    // Unregister service workers in development to avoid conflicts
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then((success) => {
            if (success) {
              console.log('Service Worker unregistered for development');
            }
          });
        });
      });
    });
  }
}
