import { Rule } from '~/sanity';
import { localeStringValidation } from '../../language/locale-validation';

export const link = {
  type: 'object',
  title: 'Een link voorzien van een label',
  name: 'link',
  preview: {
    select: {
      title: 'title.nl',
    },
  },
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
      options: {
        /**
         * This option can be set to true when all locale fields should be displayed
         */
        ignoreLanguageSwitcher: true,
      },
    },
    {
      name: 'href',
      type: 'string',
      title: 'Link naar pagina',
      validation: (rule: Rule) => rule.required(),
    },
  ],
};
