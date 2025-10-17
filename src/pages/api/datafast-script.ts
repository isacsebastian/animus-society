import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const response = await fetch('https://www.datafast.com.ec/js/dfAdditionalValidations1.js');
    
    if (!response.ok) {
      throw new Error('Failed to fetch DataFast script');
    }
    
    const script = await response.text();

    return new Response(script, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
      }
    });
  } catch (error) {
    console.error('Error loading DataFast script:', error);
    return new Response('// DataFast script not available', {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
      }
    });
  }
};