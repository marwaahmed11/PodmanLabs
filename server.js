const express = require('express');
const app = express();
const PORT = 3000;

// Read username from environment variable or use default
const username = process.env.USERNAME || 'User';

app.get('/', (req, res) => {
  res.send(`Hello ${username}, from your Node.js container running on port ${PORT}!`);
});

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
