import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data', 'strategies');

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '2mb' }));

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function strategyPath(id) {
  // evita path traversal — só permite ids alfanuméricos/hífen
  const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, '');
  return path.join(DATA_DIR, `${safeId}.json`);
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/strategies', async (_req, res) => {
  await ensureDataDir();
  const files = await fs.readdir(DATA_DIR);
  const items = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
    const data = JSON.parse(raw);
    items.push({ id: data.id, name: data.name, mapId: data.mapId, updatedAt: data.updatedAt });
  }
  res.json(items);
});

app.get('/api/strategies/:id', async (req, res) => {
  try {
    const raw = await fs.readFile(strategyPath(req.params.id), 'utf-8');
    res.json(JSON.parse(raw));
  } catch {
    res.status(404).json({ error: 'Estratégia não encontrada.' });
  }
});

app.post('/api/strategies', async (req, res) => {
  await ensureDataDir();
  const id = req.body.id || crypto.randomUUID();
  const data = {
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(strategyPath(id), JSON.stringify(data, null, 2), 'utf-8');
  res.status(201).json(data);
});

app.delete('/api/strategies/:id', async (req, res) => {
  try {
    await fs.unlink(strategyPath(req.params.id));
    res.status(204).end();
  } catch {
    res.status(404).json({ error: 'Estratégia não encontrada.' });
  }
});

app.listen(PORT, () => {
  console.log(`Tactic3D backend rodando em http://localhost:${PORT}`);
});
