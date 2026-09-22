import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// Serves the Pricing PDF directly at the clean URL so the browser's native
// PDF viewer opens it in place — same pattern as /company-profile.
function getPdfPath() {
  const rootPath = resolve(process.cwd(), 'public/Cardi.co.id - Pricing.pdf');
  if (existsSync(rootPath)) return rootPath;
  const relPath = fileURLToPath(new URL('../../public/Cardi.co.id - Pricing.pdf', import.meta.url));
  if (existsSync(relPath)) return relPath;
  return rootPath;
}

export const GET: APIRoute = () => {
  const pdfPath = getPdfPath();
  const file = existsSync(pdfPath) ? readFileSync(pdfPath) : Buffer.from('');
  return new Response(file, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Cardi-Pricing.pdf"',
    },
  });
};
