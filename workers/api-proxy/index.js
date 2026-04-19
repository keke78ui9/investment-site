// Cloudflare Worker — API proxy/gateway (Phase 2)
//
// This worker sits in front of third-party market data APIs
// (Polygon.io, Alpha Vantage, FRED, etc.) so that:
//   - API keys are never exposed to the browser
//   - Rate limiting and caching can be applied at the edge
//   - CORS headers are set correctly
//
// Deploy with: wrangler deploy

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Route: /polygon/* → Polygon.io
    if (url.pathname.startsWith('/polygon/')) {
      const target = `https://api.polygon.io${url.pathname.replace('/polygon', '')}${url.search}`;
      const response = await fetch(target, {
        headers: { Authorization: `Bearer ${env.POLYGON_API_KEY}` },
      });
      return addCors(response);
    }

    return new Response('Not found', { status: 404 });
  },
};

function addCors(response) {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  return new Response(response.body, { ...response, headers });
}
