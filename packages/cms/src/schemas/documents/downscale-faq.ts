export const downscaleFaq = {
  name: 'downscaleFaq',
  type: 'document',
  title: 'Veelgestelde vragen',
  fields: [
    {
      title: 'Vraag en antwoorden',
      name: 'faq',
      type: 'collapsible',
    },
  ],
  preview: {
    select: {
      title: 'faq.title.nl',
      subtitle: 'faq.content.nl',
    },
  },
};
