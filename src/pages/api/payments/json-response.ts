import type { APIRoute } from 'astro';

const BACKEND_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const POST: APIRoute = async ({ request, url, redirect }) => {
  try {
    const queryString = url.search;
    const endpoint = `${BACKEND_URL}/api/payments/json-response${queryString}`;

    console.log('[json-response proxy POST] Forwarding to backend:', endpoint);

    // Obtener el body de la petición
    const body = await request.text();

    // ✅ Llamar al backend en segundo plano (sin esperar respuesta)
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/x-www-form-urlencoded',
      },
      body: body,
    }).catch(err => {
      console.error('[json-response proxy POST] Error en background fetch (ignorado):', err);
    });

    // ✅ Redirigir INMEDIATAMENTE a /payment-processing
    console.log('[json-response proxy POST] Redirigiendo inmediatamente a /payment-processing');
    return redirect('/payment-processing', 302);
  } catch (error) {
    console.error('[json-response proxy POST] Error:', error);
    
    // ✅ En caso de error, también redirigir a payment-processing
    return redirect('/payment-processing', 302);
  }
};

export const GET: APIRoute = async ({ url, redirect }) => {
  try {
    const queryString = url.search;
    const endpoint = `${BACKEND_URL}/api/payments/json-response${queryString}`;
    
    console.log('[json-response proxy GET] Forwarding to backend:', endpoint);
    
    // ✅ Llamar al backend en segundo plano (sin esperar respuesta)
    fetch(endpoint, {
      method: 'GET',
    }).catch(err => {
      console.error('[json-response proxy GET] Error en background fetch (ignorado):', err);
    });
    
    // ✅ Redirigir INMEDIATAMENTE a /payment-processing
    console.log('[json-response proxy GET] Redirigiendo inmediatamente a /payment-processing');
    return redirect('/payment-processing', 302);
  } catch (error) {
    console.error('[json-response proxy GET] Error:', error);
    return redirect('/payment-processing', 302);
  }
};
