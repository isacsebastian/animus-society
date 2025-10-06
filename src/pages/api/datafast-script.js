export async function GET() {
  try {
    const response = await fetch('https://www.datafast.com.ec/js/dfAdditionalValidations1.js');
    const script = await response.text();

    return new Response(script, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
      }
    });
  } catch (error) {
    return new Response('// DataFast script not available', {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
      }
    });
  }
}