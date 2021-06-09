export const link = {
  title: 'Link',
  name: 'link',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'href',
      type: 'string',
      title: 'Link',
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      date: 'date',
    },
  },
};
