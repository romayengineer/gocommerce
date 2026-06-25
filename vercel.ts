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
  // these are not used on build-time only run-time for build-time variables set them up on vercel dashboard
  env: {
    VITE_MAP_PROVIDER: 'leaflet',
    VITE_S3_IMAGES_URL: 'https://gocommerce-assets-115663612.s3.sa-east-1.amazonaws.com/images',
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
