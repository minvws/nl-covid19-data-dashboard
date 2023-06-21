import { BsLink } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';

export const themeLink = defineType({
  type: 'document',
  title: 'Thema link',
  name: 'themeLink',
  icon: BsLink,
  fields: [
    defineField({
      title: 'Link',
      name: 'cta',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'cta.title.nl',
      subtitle: 'cta.href',
    },
  },
});
