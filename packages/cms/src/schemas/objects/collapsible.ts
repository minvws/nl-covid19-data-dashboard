export default {
  title: 'Inklapbare titel en inhoud',
  name: 'collapsible',
  type: 'object',
  fields: [
    { name: 'title', type: 'localeString', title: 'Titel' },
    { name: 'content', type: 'localeBlock', title: 'Inhoud' },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'content.nl',
    },
  },
};
