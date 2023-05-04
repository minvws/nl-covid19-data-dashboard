import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schemas';
import { Logo } from './components/logo';
import { theme } from './studio/theme';
import structure from './studio/desk-structure';

export default defineConfig({
  title: 'Coronavirus Dashboard CMS',
  projectId: '5mog5ask',

  // TODO: figure out how to use environment variables
  // dataset: process.env.NEXT_PUBLIC_PHASE === 'develop' ? 'development' : 'production',
  dataset: 'development',

  // TODO: either remove this or set up a [[...studio]].tsx route inside the app package for a 'self-hosted' Sanity studio page
  // basePath: '/studio',

  plugins: [
    deskTool({
      structure,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {},
  tools: [],
  studio: {
    components: {
      logo: Logo,
    },
  },
  theme,
});
