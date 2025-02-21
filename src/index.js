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

// Clear outdated cache
const clearCache = () => {
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
  });
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload(true);
};

// Inject a "Refresh App" button for mobile users
const refreshButton = document.createElement("button");
refreshButton.innerText = "Refresh App";
refreshButton.style.position = "fixed";
refreshButton.style.bottom = "10px";
refreshButton.style.right = "10px";
refreshButton.style.padding = "10px 20px";
refreshButton.style.zIndex = "1000";
refreshButton.style.background = "#f00";
refreshButton.style.color = "#fff";
refreshButton.style.border = "none";
refreshButton.style.borderRadius = "5px";
refreshButton.onclick = clearCache;
document.body.appendChild(refreshButton);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <AuthProvider> <App /></AuthProvider>
  // </React.StrictMode>
);