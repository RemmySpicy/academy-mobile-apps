// Web-specific polyfills
if (typeof globalThis.import === 'undefined') {
  globalThis.import = {
    meta: {
      url: window.location.href,
      env: process.env,
    },
  };
}

// Import the main entry point
import './index.js';