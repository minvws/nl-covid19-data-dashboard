import {
  localeStringValidation,
  localeValidation,
} from '../../language/locale-validation';

export const figureExplanationItem = {
  title: 'Inklapbare titel en inhoud voor cijferverantwoording',
  name: 'figureExplanationItem',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.required()),
    },
    {
      name: 'content',
      type: 'localeBlock',
      title: 'Inhoud',
      validation: localeValidation((rule) => rule.required()),
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'content.nl',
    },
  },
};
