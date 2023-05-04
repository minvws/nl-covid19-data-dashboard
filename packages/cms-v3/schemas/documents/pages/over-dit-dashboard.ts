import { defineType, defineField } from 'sanity';

export const overDitDashboard = defineType({
  name: 'overDitDashboard',
  type: 'document',
  title: 'Over dit dashboard',
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Titel',
    }),
    defineField({
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving',
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
});
