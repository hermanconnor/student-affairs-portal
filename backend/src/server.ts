import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
