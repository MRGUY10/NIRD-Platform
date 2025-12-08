// Simple Express server to serve the built frontend
// Properly binds to 0.0.0.0 and uses PORT from environment

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - all routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 NIRD Platform Frontend running on http://${HOST}:${PORT}`);
  console.log(`📁 Serving from: ${path.join(__dirname, 'dist')}`);
});
