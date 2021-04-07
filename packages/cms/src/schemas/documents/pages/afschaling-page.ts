export default {
  name: 'afschaling',
  type: 'document',
  title: 'Afschaling maatregelen',
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
