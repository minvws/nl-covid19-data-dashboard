import { localeStringValidation } from '../../language/locale-validation';

export const collapsible = {
  title: 'Inklapbare titel en inhoud',
  name: 'collapsible',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.reset().required()),
    },
    {
      name: 'content',
      type: 'localeBlock',
      title: 'Inhoud',
      validation: localeStringValidation((rule) => rule.reset().required()),
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'content.nl',
    },
  },
};
