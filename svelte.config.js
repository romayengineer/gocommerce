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
    output: {
      bundleStrategy: 'inline'
    },
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true
    })
  }
};

export default config;
