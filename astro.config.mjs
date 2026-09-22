import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://aiagent.cardi.co.id',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [sitemap(), react()],
});
