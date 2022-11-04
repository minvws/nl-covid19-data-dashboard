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
    },
    {
      title: 'Thema\'s',
      description: 'De themas onderverdeeld in tegels',
      name: 'themes',
      type: 'array',
      of: [{ type: 'theme' }],
    },
  ],
};
