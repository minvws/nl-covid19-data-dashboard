import { BsBook } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';

export const pageIdentifier = defineType({
  name: 'pageIdentifier',
  type: 'document',
  title: "Pagina ID's",
  icon: BsBook,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titel',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'identifier',
      type: 'string',
      title: 'ID',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
});
