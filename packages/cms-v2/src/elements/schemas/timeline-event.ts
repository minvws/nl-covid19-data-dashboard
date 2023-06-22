import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { localeStringValidation } from '../../language/locale-validation';

const REQUIRED = (x: Rule) => x.required();
const DATE_FORMAT = 'YYYY-MM-DD';

export const timelineEvent = {
  name: 'timelineEvent',
  type: 'object',
  title: 'Timeline Event',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required().max(60).error('Titels zijn gelimiteerd tot maximaal 60 tekens')),
      options: {
        ignoreLanguageSwitcher: true,
      },
    },
    {
      title: 'Omschrijving',
      name: 'description',
      type: 'localeText',
      validation: REQUIRED,
      options: {
        ignoreLanguageSwitcher: true,
      },
    },
    {
      title: 'Datum',
      name: 'date',
      type: 'date',
      options: {
        dateFormat: DATE_FORMAT,
      },
      validation: REQUIRED,
    },
    {
      title: 'Einddatum (optioneel)',
      name: 'dateEnd',
      type: 'date',
      options: {
        dateFormat: DATE_FORMAT,
      },
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      date: 'date',
      dateEnd: 'dateEnd',
    },
    prepare(x: { title: string; date: string; dateEnd?: string }) {
      return {
        title: x.title,
        subtitle: [x.date, x.dateEnd].filter(isDefined).join(' tot '),
      };
    },
  },
};
