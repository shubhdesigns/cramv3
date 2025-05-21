**public/robots.txt**
```
User-agent: *
Allow: /
Sitemap: https://cramtime.com/sitemap.xml
```

**public/sitemap.xml (sample entry)**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cramtime.com/</loc>
    <lastmod>2024-06-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://cramtime.com/quiz/demo123</loc>
    <lastmod>2024-06-01</lastmod>
    <priority>0.7</priority>
  </url>
  <!-- add more dynamically or generate in Astro build -->
</urlset>
```