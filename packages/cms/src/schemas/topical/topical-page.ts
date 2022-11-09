import { REQUIRED } from '../../validation';

export const topicalPageConfig = {
  name: 'topicalPageConfig',
  type: 'document',
  title: 'Topical pagina',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Omschrijving',
      name: 'description',
      type: 'localeRichContentBlock',
      validation: REQUIRED,
    },
    {
      title: "Thema's",
      description: 'De themas onderverdeeld in tegels en links',
      name: 'themes',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'theme' } }],
      validation: REQUIRED,
    },
  ],
};
