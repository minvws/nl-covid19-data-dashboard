import { BsClock } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';
import { localeStringValidation } from '../../studio/validation/locale-validation';

const DATE_FORMAT = 'YYYY-MM-DD';

export const timelineEvent = defineType({
  name: 'timelineEvent',
  type: 'object',
  title: 'Timeline Event',
  icon: BsClock,
  fields: [
    defineField({
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required().max(60).error('Titels zijn gelimiteerd tot maximaal 60 tekens')),
      options: {
        ignoreLanguageSwitcher: true,
      },
    }),
    defineField({
      title: 'Omschrijving',
      name: 'description',
      type: 'localeText',
      validation: (rule) => rule.required(),
      options: {
        ignoreLanguageSwitcher: true,
      },
    }),
    defineField({
      title: 'Datum',
      name: 'date',
      type: 'date',
      options: {
        dateFormat: DATE_FORMAT,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Einddatum (optioneel)',
      name: 'dateEnd',
      type: 'date',
      options: {
        dateFormat: DATE_FORMAT,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
      date: 'date',
      dateEnd: 'dateEnd',
    },
    prepare({ title, date, dateEnd }: { title: string; date: string; dateEnd?: string }) {
      return {
        title,
        subtitle: [date, dateEnd].filter(Boolean).join(' tot '),
      };
    },
  },
});
