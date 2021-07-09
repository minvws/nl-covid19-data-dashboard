import {
  localeStringValidation,
  localeValidation,
} from '../../language/locale-validation';

export const titleDescriptionBlock = {
  title: 'Titel en toelichting blok',
  name: 'titleDescriptionBlock',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.required()),
    },
    {
      name: 'description',
      type: 'localeBlock',
      title: 'Toelichting',
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
