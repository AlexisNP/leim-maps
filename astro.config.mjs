import { defineConfig, envField } from 'astro/config';

import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), sitemap()],
  output: 'static',
  site: 'https://maps.alexcreates.fr',
  prefetch: true,
  env: {
    schema: {
      ENABLE_TOOLBAR: envField.boolean({ context: "server", access: "secret", default: true }),
      ENABLE_TOOLBAR_TAGS: envField.boolean({ context: "server", access: "secret", default: true }),
      ENABLE_CUSTOM_MARKERS: envField.boolean({ context: "server", access: "secret", default: true }),
      ENABLE_BREADCRUMB: envField.boolean({ context: "server", access: "secret", default: true }),
      ENABLE_I18N: envField.boolean({ context: "server", access: "secret", default: true }),
    }
  }
});
