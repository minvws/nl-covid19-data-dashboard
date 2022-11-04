
import { Rule } from '~/sanity';

export const topicalPageConfig = {
  name: 'topicalPageConfig',
  type: 'document',
  title: 'Topical pagina',
  __experimental_actions: ['create', 'update', 'publish'],
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Omschrijving',
      name: 'description',
      type: 'localeRichContentBlock',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Thema\'s',
      description: 'De themas onderverdeeld in tegels',
      name: 'themes',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'theme' } }],
      validation: (rule: Rule) => rule.required(),
    },
  ],
};
