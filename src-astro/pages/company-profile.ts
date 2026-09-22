import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// Serves the PDF directly at the clean /company-profile URL (no .pdf in the
// address bar) so the browser's native PDF viewer opens it in place — no
// custom HTML wrapper, no iframe/embed, nothing for a download-manager
// extension to hijack.
function getPdfPath() {
  const rootPath = resolve(process.cwd(), 'public/company-profile.pdf');
  if (existsSync(rootPath)) return rootPath;
  const relPath = fileURLToPath(new URL('../../public/company-profile.pdf', import.meta.url));
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
      'Content-Disposition': 'inline; filename="Cardi-Company-Profile.pdf"',
    },
  });
};
