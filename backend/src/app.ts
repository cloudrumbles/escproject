import * as express from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';

const app = express();
const port = 3000;

// Endpoint 1: Returns the first JSON file
app.get('/api/data1', async (req: express.Request, res: express.Response) => {
  try {
    const filePath = path.join(__dirname, 'data1.json');
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint 2: Returns the second JSON file
app.get('/api/data2', async (req: express.Request, res: express.Response) => {
  try {
    const filePath = path.join(__dirname, 'data2.json');
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export {};