import { BsFolder } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';
import { localeStringValidation, localeValidation } from '../../../../studio/validation/locale-validation';
import { IconInput } from '../../../../components/icon-input';

export const dataExplainedItem = defineType({
  title: 'Verantwoordingen',
  name: 'cijferVerantwoordingItem',
  type: 'document',
  icon: BsFolder,
  fieldsets: [
    {
      title: 'Metadata',
      name: 'metadata',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Icoon',
      name: 'icon',
      type: 'string',
      components: {
        input: IconInput,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title.nl',
      },
      fieldset: 'metadata',
      validation: (rule) => rule.required(),
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
      to: [{ type: 'cijferVerantwoordingGroups' }],
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
