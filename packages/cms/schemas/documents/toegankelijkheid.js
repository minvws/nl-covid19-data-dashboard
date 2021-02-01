export default {
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
