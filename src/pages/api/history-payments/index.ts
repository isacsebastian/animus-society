import type { APIRoute } from 'astro';

const BACKEND_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const GET: APIRoute = async ({ url }) => {
  try {
    // Obtener todos los parámetros de búsqueda
    const searchParams = url.searchParams;
    const queryString = searchParams.toString();
    
    const backendUrl = `${BACKEND_URL}/api/history-payments${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(backendUrl, {
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
    console.error('Error in history-payments proxy:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al obtener el historial de pagos',
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
