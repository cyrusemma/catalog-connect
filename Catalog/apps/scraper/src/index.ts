import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Scraper endpoints
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    // TODO: Implement scraping logic
    res.json({ status: 'scraping', url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/scrape/:id', (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Return scrape status
    res.json({ id, status: 'pending' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Scraper service running on port ${PORT}`);
});
