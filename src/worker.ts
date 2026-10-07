export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

function buildSitemapXml(origin: string): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${cleanOrigin}/</loc>
  </url>
  <url>
    <loc>${cleanOrigin}/en</loc>
  </url>
</urlset>`;
}

function buildSitemapTxt(origin: string): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  return `${cleanOrigin}/\n${cleanOrigin}/en\n`;
}

function buildRobotsTxt(origin: string): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  return `User-agent: *
Allow: /

Sitemap: ${cleanOrigin}/sitemap.xml
`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = url.origin;
    const pathname = (url.pathname.replace(/\/+$/, '') || '/').toLowerCase();

    // 1. Dynamic XML Sitemaps
    if (
      pathname === '/sitemap.xml' ||
      pathname === '/sitemap-main.xml' ||
      pathname === '/sitemap2.xml' ||
      pathname === '/sitemap_index.xml' ||
      pathname === '/sitemap-index.xml' ||
      pathname === '/sitemap'
    ) {
      const xml = buildSitemapXml(origin);
      return new Response(request.method === 'HEAD' ? null : xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'X-Robots-Tag': 'all',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 2. Dynamic Plain-Text Sitemap (/sitemap.txt)
    if (pathname === '/sitemap.txt') {
      const txt = buildSitemapTxt(origin);
      return new Response(request.method === 'HEAD' ? null : txt, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'X-Robots-Tag': 'all',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 3. Dynamic robots.txt with exact domain
    if (pathname === '/robots.txt') {
      const robots = buildRobotsTxt(origin);
      return new Response(request.method === 'HEAD' ? null : robots, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 4. Permanent Google Search Console verification file
    if (pathname === '/google1c5f3169018b1d05.html') {
      return new Response(
        request.method === 'HEAD'
          ? null
          : 'google-site-verification: google1c5f3169018b1d05.html',
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
          }
        }
      );
    }

    // 5. Serve /en and /en/ directly with 200 OK
    if (pathname === '/en') {
      const enUrl = new URL('/en/index.html', request.url);
      const enRes = await env.ASSETS.fetch(new Request(enUrl.toString(), request));
      if (enRes.ok) {
        return new Response(enRes.body, {
          status: 200,
          headers: enRes.headers
        });
      }
    }

    // 6. Serve static assets from ./dist, with SPA fallback to /index.html on 404
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status === 404) {
      const indexUrl = new URL('/index.html', request.url);
      return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
    }

    return assetResponse;
  }
};
