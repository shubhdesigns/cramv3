// This file initializes Firebase only on the client side
// It's meant to be imported by components that need Firebase functionality

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize Firebase only in the browser
if (isBrowser) {
  // Dynamically import the client-side Firebase implementation
  import('./firebase.client.js')
    .then(module => {
      // Replace the dummy exports with the real Firebase implementation
      Object.assign(window, {
        __FIREBASE_INITIALIZED__: true,
        __FIREBASE_MODULE__: module
      });
      console.log('Firebase initialized on client');
    })
    .catch(error => {
      console.error('Error initializing Firebase on client:', error);
    });
}

// Export a function to get the Firebase module
export const getFirebaseModule = () => {
  if (isBrowser && window.__FIREBASE_INITIALIZED__) {
    return window.__FIREBASE_MODULE__;
  }
  return null;
};

// Export a helper to safely use Firebase only on the client side
export const useFirebase = (callback) => {
  if (isBrowser) {
    // If Firebase is already initialized, call the callback immediately
    if (window.__FIREBASE_INITIALIZED__) {
      callback(window.__FIREBASE_MODULE__);
      return;
    }

    // Otherwise, wait for Firebase to initialize
    const checkInterval = setInterval(() => {
      if (window.__FIREBASE_INITIALIZED__) {
        clearInterval(checkInterval);
        callback(window.__FIREBASE_MODULE__);
      }
    }, 100);

    // Clean up after 10 seconds to avoid memory leaks
    setTimeout(() => clearInterval(checkInterval), 10000);
  }
};
