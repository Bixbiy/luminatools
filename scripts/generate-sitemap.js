// Generate sitemap.xml for SEO
// Run with: node scripts/generate-sitemap.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://luminatools.com'; // Update with your domain

const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/tools/json-formatter', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/base64-converter', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/hash-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/uuid-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/code-formatter', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/regex-tester', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/qr-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/age-calculator', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/percentage-calculator', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/emi-calculator', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/unit-converter', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/currency-converter', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/meta-tag-generator', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/word-counter', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/image-compressor', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/image-resizer', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/image-format-converter', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/pdf-merger', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/pdf-splitter', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/video-to-mp3', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/text-summarizer', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/keyword-extractor', priority: '0.7', changefreq: 'monthly' },
];

const generateSitemap = () => {
  const now = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
};

generateSitemap();
