export const themeCollection = {
  type: 'document',
  title: 'Thema collectie',
  name: 'themeCollection',
  fields: [
    {
      title: 'themas',
      description: 'De thema\'s onderverdeeld in tegels',
      name: 'themes',
      type: 'array',
      of: [{ type: 'theme' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }: { title: string }) {
      return {
        title,
      };
    },
  },
};
