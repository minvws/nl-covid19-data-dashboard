import { BsFolder } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';
import { localeStringValidation } from '../../../../studio/validation/locale-validation';
import { IconInput } from '../../../../components/icon-input';

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
    defineField({
      name: 'icon',
      type: 'string',
      title: 'Groepsicoon',
      components: {
        input: IconInput,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'group.nl',
    },
  },
});
