export const contact = {
  name: 'contact',
  type: 'document',
  title: 'Contact',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
    },
    {
      name: 'description',
      type: 'localeBlock',
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
