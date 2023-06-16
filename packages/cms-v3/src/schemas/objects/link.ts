import { BsLink } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';
import { localeStringValidation } from '../../studio/validation/locale-validation';
import { LocaleString } from '../locale/string';

export type Link = {
  title: LocaleString;
  href: string;
};

export const link = defineType({
  type: 'object',
  title: 'Een link voorzien van een label',
  name: 'link',
  icon: BsLink,
  fields: [
    defineField({
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
    }),
    defineField({
      name: 'href',
      type: 'string',
      title: 'Link naar pagina',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
    },
  },
});
