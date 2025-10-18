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

    // Si el backend devuelve un redirect (302, 301, etc.)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location');
      console.log('[json-response proxy] Redirecting to:', location);
      
      if (location) {
        // Hacer el redirect desde Astro (siempre usar 302)
        return redirect(location, 302);
      }
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
    
    // En caso de error, redirigir a payment-success con error
    const errorData = {
      error: true,
      success: false,
      message: error instanceof Error ? error.message : 'Error procesando el pago',
    };
    
    const encodedData = encodeURIComponent(JSON.stringify(errorData));
    const errorUrl = `/payment-success?payment=${encodedData}`;
    
    return redirect(errorUrl, 302);
  }
};

export const GET: APIRoute = async ({ url, redirect }) => {
  try {
    const queryString = url.search;
    const endpoint = `${BACKEND_URL}/api/payments/json-response${queryString}`;

    console.log('[json-response proxy] Forwarding GET to:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      redirect: 'manual',
    });

    console.log('[json-response proxy] Backend response status:', response.status);

    // Si el backend devuelve un redirect
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location');
      console.log('[json-response proxy] Redirecting to:', location);
      
      if (location) {
        return redirect(location, 302);
      }
    }

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('[json-response proxy] Error:', error);
    
    const errorData = {
      error: true,
      success: false,
      message: error instanceof Error ? error.message : 'Error procesando el pago',
    };
    
    const encodedData = encodeURIComponent(JSON.stringify(errorData));
    const errorUrl = `/payment-success?payment=${encodedData}`;
    
    return redirect(errorUrl, 302);
  }
};
