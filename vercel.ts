import type { VercelConfig } from '@vercel/config/v1';

const config: VercelConfig = {
  // Project naming
  name: 'gocommerce',

  // Build configuration
  buildCommand: 'npm run build',
  installCommand: 'npm install',
  outputDirectory: 'build',
  framework: 'sveltekit',

  // Environment variables
  env: {
    VITE_MAP_PROVIDER: 'leaflet',
  },

  // URL handling for static site with hash routing
  cleanUrls: false,
  trailingSlash: false,

  // Git configuration
  git: {
    deploymentEnabled: {
      build: true,
      main: false,
    },
  },
};

export default config;
