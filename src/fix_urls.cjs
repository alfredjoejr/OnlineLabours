const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// Replace single-quoted fetch URLs
content = content.replace(/'http:\/\/tasklink\.test\/api([^']*)'/g, "`${import.meta.env.VITE_API_BASE_URL || 'http://tasklink.test/api'}$1`");

// Replace backtick-quoted fetch URLs
content = content.replace(/`http:\/\/tasklink\.test\/api([^`]*)`/g, "`${import.meta.env.VITE_API_BASE_URL || 'http://tasklink.test/api'}$1`");

// Replace storage URL logic
content = content.replace(/`http:\/\/tasklink\.test\/storage\//g, "`${(import.meta.env.VITE_API_BASE_URL || 'http://tasklink.test/api').replace('/api', '')}/storage/");

// Fix hardcoded error messages
content = content.replace(/http:\/\/tasklink\.test/g, "your backend URL");

fs.writeFileSync('App.tsx', content);
console.log('Replaced hardcoded URLs successfully.');
