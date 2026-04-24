const fetch = require('node-fetch');

const NOTION_BASE = 'https://api.notion.com/v1';
const NOTION_VER  = '2022-06-28';

function notionHeaders() {
  return {
    'Authorization': 'Bearer ' + process.env.NOTION_TOKEN,
    'Notion-Version': NOTION_VER,
    'Content-Type': 'application/json'
  };
}

exports.handler = async (event) => {
  // Path comes in as /api/notion/pages or /api/notion/blocks/ID/children etc.
  const path    = event.path.replace(/^\/.netlify\/functions\/notion/, '');
  const method  = event.httpMethod;
  const url     = NOTION_BASE + path;

  try {
    const options = { method, headers: notionHeaders() };
    if (event.body && ['POST','PATCH'].includes(method)) {
      options.body = event.body;
    }

    const res  = await fetch(url, options);
    const text = await res.text();

    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
