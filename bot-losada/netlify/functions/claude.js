bash

cat /home/claude/bot-losada/netlify/functions/claude.js
Salida

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: { message: 'Method Not Allowed' } }) };
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: { message: 'ERROR: ANTHROPIC_API_KEY no encontrada en variables de entorno de Netlify.' } })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: { message: 'JSON inválido: ' + e.message } }) };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status, headers,
        body: JSON.stringify({ error: { message: 'Anthropic error ' + response.status + ': ' + (data.error?.message || JSON.stringify(data)) } })
      };
    }

    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (error) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: { message: 'Excepción del servidor: ' + error.message } })
    };
  }
};
Listo
Copia ese código completo, pégalo en GitHub reemplazando el contenido actual de claude.js, y haz clic en "Commit changes".

Netlify redesplegará automáticamente. Luego prueba el bot — esta vez mostrará el error exacto en pantalla en lugar del mensaje genérico, lo que nos dirá exactamente qué está fallando. ¿Puedes editar el archivo en GitHub?





