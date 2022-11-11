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
  ],
};
