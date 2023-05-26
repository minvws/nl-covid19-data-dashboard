import { dashboardTool } from '@sanity/dashboard';
import { languageFilter } from '@sanity/language-filter';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { media } from 'sanity-plugin-media';
import { deskTool } from 'sanity/desk';
import { Logo } from './components/logo';
import { schemaTypes } from './schemas';
import { deskStructure } from './studio/desk-structure/desk-structure';
import { actions, newDocumentOptions } from './studio/document-options';
import { supportedLanguages } from './studio/i18n';
import { theme } from './studio/theme';
import { tools } from './studio/tools';
import { widgets } from './studio/widgets';

export default defineConfig({
  title: 'Coronavirus Dashboard CMS',
  projectId: '5mog5ask',

  // TODO: figure out how to use environment variables
  // dataset: process.env.NEXT_PUBLIC_PHASE === 'develop' ? 'development' : 'production',
  dataset: 'development',

  // TODO: either remove this or set up a [[...studio]].tsx route inside the app package for a 'self-hosted' Sanity studio page
  // basePath: '/studio',

  plugins: [
    dashboardTool({
      // TODO: figure out if widgets can be grouped as on V2 of the CMS, but without custom components
      widgets,
    }),
    deskTool({
      structure: deskStructure,
    }),
    media(),
    visionTool(),
    languageFilter({
      supportedLanguages,
      defaultLanguages: ['nl'],
      // documentTypes: [],
      filterField: (enclosingType, field, selectedLanguageIds) => !enclosingType.name.startsWith('locale') || selectedLanguageIds.includes(field.name),
    }),
  ],
  schema: { types: schemaTypes },
  studio: { components: { logo: Logo } },
  document: { newDocumentOptions, actions },
  tools,
  theme,
});
