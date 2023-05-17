import { BsFolder } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';
import { localeStringValidation } from '../../../../studio/validation/locale-validation';

export const dataExplainedGroups = defineType({
  title: 'Groepen',
  name: 'cijferVerantwoordingGroups',
  type: 'document',
  icon: BsFolder,
  fields: [
    defineField({
      name: 'group',
      type: 'localeString',
      title: 'Groepsnaam',
      validation: localeStringValidation((rule) => rule.required()),
    }),
  ],
  preview: {
    select: {
      title: 'group.nl',
    },
  },
});
