import type { APIRoute } from 'astro';

const BACKEND_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const GET: APIRoute = async ({ url }) => {
  try {
    const queryString = url.search;

    const response = await fetch(`${BACKEND_URL}/api/payments/json-response${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in json-response proxy:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
