import { BsFolder } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';
import { localeStringValidation, localeValidation } from '../../../../studio/validation/locale-validation';

export const faqItem = defineType({
  title: 'Vragen',
  name: 'faqQuestion',
  type: 'document',
  icon: BsFolder,
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'content',
      type: 'localeBlock',
      title: 'Inhoud',
      validation: localeValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'group',
      type: 'reference',
      to: [{ type: 'veelgesteldeVragenGroups' }],
      title: 'Groep',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'group.group.nl',
    },
  },
});
