require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const NOTION_BASE = 'https://api.notion.com/v1';
const NOTION_VER  = '2022-06-28';

function notionHeaders() {
  return {
    'Authorization': 'Bearer ' + process.env.NOTION_TOKEN,
    'Notion-Version': NOTION_VER,
    'Content-Type': 'application/json'
  };
}

// ── Send config to frontend (no secrets) ──
app.get('/api/config', (req, res) => {
  res.json({
    cloudinaryCloud:  process.env.CLOUDINARY_CLOUD,
    cloudinaryPreset: process.env.CLOUDINARY_PRESET,
    countriesDb:      process.env.COUNTRIES_DB,
    citiesDb:         process.env.CITIES_DB
  });
});

// ── Create a Notion page ──
app.post('/api/notion/pages', async (req, res) => {
  try {
    const response = await fetch(`${NOTION_BASE}/pages`, {
      method: 'POST',
      headers: notionHeaders(),
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Notion error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Update a Notion page ──
app.patch('/api/notion/pages/:pageId', async (req, res) => {
  try {
    const response = await fetch(`${NOTION_BASE}/pages/${req.params.pageId}`, {
      method: 'PATCH',
      headers: notionHeaders(),
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Notion error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Get blocks of a Notion page ──
app.get('/api/notion/blocks/:pageId/children', async (req, res) => {
  try {
    const response = await fetch(`${NOTION_BASE}/blocks/${req.params.pageId}/children`, {
      method: 'GET',
      headers: notionHeaders()
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Notion error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Delete a Notion block ──
app.delete('/api/notion/blocks/:blockId', async (req, res) => {
  try {
    const response = await fetch(`${NOTION_BASE}/blocks/${req.params.blockId}`, {
      method: 'DELETE',
      headers: notionHeaders()
    });
    const data = response.status === 200 ? await response.json() : {};
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Notion error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Append blocks to a Notion page ──
app.patch('/api/notion/blocks/:pageId/children', async (req, res) => {
  try {
    const response = await fetch(`${NOTION_BASE}/blocks/${req.params.pageId}/children`, {
      method: 'PATCH',
      headers: notionHeaders(),
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Notion error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('  ✈  Travel Wiki running at http://localhost:' + PORT);
  console.log('  ✓  Notion token loaded from .env');
  console.log('  ✓  No credentials in your HTML');
  console.log('');
});
