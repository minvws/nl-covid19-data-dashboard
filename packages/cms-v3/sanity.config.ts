import { dashboardTool } from '@sanity/dashboard';
import { languageFilter } from '@sanity/language-filter';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { media } from 'sanity-plugin-media';
import { deskTool } from 'sanity/desk';
import { Logo } from './components/logo';
import { schemaTypes } from './schemas';
import { deskStructure } from './studio/desk-structure/desk-structure';
import { actions, newDocumentOptions } from './studio/document-options/document-options';
import { supportedLanguages } from './studio/i18n';
import { theme } from './studio/theme';
import { tools } from './studio/tools';
import { widgets } from './studio/widgets';

export default defineConfig({
  title: 'Coronavirus Dashboard CMS',
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET,
  plugins: [
    dashboardTool({
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
      filterField: (enclosingType, field, selectedLanguageIds) => !enclosingType.name.startsWith('locale') || selectedLanguageIds.includes(field.name),
    }),
  ],
  schema: { types: schemaTypes },
  studio: { components: { logo: Logo } },
  document: { newDocumentOptions, actions },
  tools,
  theme,
});
