export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

function buildSitemapXml(origin: string): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  const urls = [
    `${cleanOrigin}/`,
    `${cleanOrigin}/en`,
    `${cleanOrigin}/?country=France`,
    `${cleanOrigin}/en?country=France`,
    `${cleanOrigin}/?country=USA`,
    `${cleanOrigin}/en?country=USA`,
    `${cleanOrigin}/?country=China`,
    `${cleanOrigin}/?country=Brazil`,
    `${cleanOrigin}/?country=Germany`,
    `${cleanOrigin}/?country=Canada`,
    `${cleanOrigin}/?country=Switzerland`,
    `${cleanOrigin}/?country=Morocco`,
    `${cleanOrigin}/?country=Belgium`,
    `${cleanOrigin}/?country=Spain`,
    `${cleanOrigin}/?country=Italy`,
    `${cleanOrigin}/?country=Japan`,
    `${cleanOrigin}/?country=India`
  ];

  const entries = urls
    .map(
      (loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

function buildRobotsTxt(origin: string): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  return `User-agent: *\nAllow: /\nAllow: /en\nAllow: /sitemap.xml\n\nSitemap: ${cleanOrigin}/sitemap.xml\n`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = url.origin;
    const pathname = url.pathname.replace(/\/+$/, '') || '/';

    // 1. Dynamic Sitemap XML matching the exact active domain (workers.dev subdomain or custom domain)
    if (
      pathname === '/sitemap.xml' ||
      pathname === '/sitemap_index.xml' ||
      pathname === '/sitemap'
    ) {
      const xml = buildSitemapXml(origin);
      return new Response(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }

    // 2. Dynamic robots.txt pointing to the exact active domain's sitemap.xml
    if (pathname === '/robots.txt') {
      const robots = buildRobotsTxt(origin);
      return new Response(robots, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 3. Permanent Google Search Console HTML verification file
    if (pathname === '/google1c5f3169018b1d05.html') {
      return new Response('google-site-verification: google1c5f3169018b1d05.html', {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // 4. Serve static assets from ./dist
    return env.ASSETS.fetch(request);
  }
};
