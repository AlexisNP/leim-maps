import { defineConfig } from 'astro/config';

import { availableLangs, defaultLang } from './src/i18n/ui';

import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";


// https://astro.build/config
export default defineConfig({
  integrations: [vue(), sitemap()],
  output: 'static',
  site: 'https://maps.alexcreates.fr',
//   i18n: {
//     locales: availableLangs,
//     defaultLocale: defaultLang,
//     routing: {
//         prefixDefaultLocale: true,
//     }
//   }
});
