import adapter from '@sveltejs/adapter-static';

/**
 * The bundle strategy option affects how your app's JavaScript and CSS files are loaded.
 * - If `'split'`, splits the app up into multiple .js/.css files so that they are loaded lazily as the user navigates around the app. This is the default, and is recommended for most scenarios.
 * - If `'single'`, creates just one .js bundle and one .css file containing code for the entire app.
 * - If `'inline'`, inlines all JavaScript and CSS of the entire app into the HTML. The result is usable without a server (i.e. you can just open the file in your browser).
 */

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    alias: {
      // Workspace packages enforce the inward-dependency DAG via their
      // package.json dependencies; aliases only tell the bundler where
      // the sources live (no build step — resolved straight to src).
      '@gocommerce/domain': 'packages/core/domain/src',
      '@gocommerce/ports': 'packages/core/ports/src',
      '@gocommerce/config': 'packages/core/config/src',
      '@gocommerce/application': 'packages/core/application/src',
      '@gocommerce/adapters': 'packages/adapters/browser/src',
      '@gocommerce/adapters-maps': 'packages/adapters/maps/src',
      '@gocommerce/foundation': 'packages/core/foundation/src',
      '@gocommerce/ui-core': 'packages/ui/core/src',
      '@gocommerce/composition': 'packages/app/composition/src',
      '@gocommerce/ui-primitives': 'packages/ui/primitives/src',
      '@gocommerce/ui-catalog': 'packages/ui/catalog/src',
      '@gocommerce/ui-purchase': 'packages/ui/purchase/src',
      '@gocommerce/ui-shell': 'packages/ui/shell/src'
    },
    files: {
      // $lib resolves to the primitives package (leaf UI components).
      // Feature packages and routes import each other via the scoped
      // `@gocommerce/ui-*` aliases above so the package DAG stays explicit.
      lib: 'packages/ui/primitives/src'
    },
    output: {
      bundleStrategy: 'inline'
    },
    router: {
      type: 'hash'
    },
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true
    })
  },
  vitePlugin: {
    inspector: false,
  }
};

export default config;
