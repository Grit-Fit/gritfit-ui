import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
// import reportWebVitals from './reportWebVitals';

// Force refresh if a new version is deployed
const version = "1.0.4"; // Update this with every deployment
if (localStorage.getItem("app_version") !== version) {
  localStorage.setItem("app_version", version);
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
  });
  window.location.reload(true);
}

// Unregister service worker to prevent stale cache issues
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <AuthProvider> <App /></AuthProvider>
  // </React.StrictMode>
);