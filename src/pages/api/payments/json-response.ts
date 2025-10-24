import type { APIRoute } from 'astro';

const BACKEND_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const POST: APIRoute = async ({ request, url, redirect }) => {
  try {
    const queryString = url.search;
    const endpoint = `${BACKEND_URL}/api/payments/json-response${queryString}`;

    console.log('[json-response proxy] Forwarding POST to:', endpoint);

    // Obtener el body de la petición
    const body = await request.text();

    // Reenviar la petición al backend
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/x-www-form-urlencoded',
      },
      body: body,
      redirect: 'manual', // No seguir redirects automáticamente
    });

    console.log('[json-response proxy] Backend response status:', response.status);

    // ✅ SOLUCIÓN: SIEMPRE redirigir a /payment-processing
    // Sin importar si el backend dice /payment-success o cualquier otra cosa
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location');
      console.log('[json-response proxy] Backend quería redirigir a:', location);
      console.log('[json-response proxy] Redirigiendo a /payment-processing en su lugar');
      
      // SIEMPRE redirigir a payment-processing
      return redirect('/payment-processing', 302);
    }

    // Si no es redirect, devolver la respuesta tal cual
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('[json-response proxy] Error:', error);
    
    // ✅ En caso de error, también redirigir a payment-processing
    console.log('[json-response proxy] Error capturado - redirigiendo a /payment-processing');
    return redirect('/payment-processing', 302);
  }
};

export const GET: APIRoute = async ({ url, redirect }) => {
  try {
    // ✅ SOLUCIÓN DIRECTA: Siempre redirigir a payment-processing
    // El backend procesará en segundo plano vía webhook
    console.log('[json-response proxy] GET request recibido, redirigiendo a /payment-processing');
    console.log('[json-response proxy] Query string:', url.search);
    
    // Extraer parámetros para pasarlos al backend en segundo plano si es necesario
    const queryString = url.search;
    const endpoint = `${BACKEND_URL}/api/payments/json-response${queryString}`;
    
    // Llamar al backend en segundo plano (sin esperar respuesta)
    fetch(endpoint, {
      method: 'GET',
      redirect: 'manual',
    }).catch(err => {
      console.error('[json-response proxy] Error en background fetch:', err);
    });
    
    // Redirigir inmediatamente sin esperar
    return redirect('/payment-processing', 302);
  } catch (error) {
    console.error('[json-response proxy] Error general:', error);
    return redirect('/payment-processing', 302);
  }
};
