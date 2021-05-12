export const toegankelijkheid = {
  name: 'toegankelijkheid',
  type: 'document',
  title: 'Toegankelijkheid',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
    },
    {
      name: 'description',
      type: 'localeRichContentBlock',
      title: 'Beschrijving',
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
};
