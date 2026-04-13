exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const NOTION_VER   = '2022-06-28';

  try {
    const body = JSON.parse(event.body);
    const { endpoint, payload } = body;

    const notionRes = await fetch(`https://api.notion.com/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_VER,
        'Authorization': 'Bearer ' + NOTION_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await notionRes.json();
    return {
      statusCode: notionRes.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
