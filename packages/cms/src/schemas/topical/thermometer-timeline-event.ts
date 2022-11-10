import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { localeStringValidation } from '../../language/locale-validation';

import { REQUIRED, REQUIRED_MIN_MAX } from '../../validation';

import { THERMOMETER_MIN_VALUE, THERMOMETER_MAX_VALUE } from './thermometer';

const DATE_FORMAT = 'YYYY-MM-DD';

export const thermometerTimelineEvent = {
  name: 'thermometerTimelineEvent',
  type: 'document',
  title: 'Thermometer tijdlijn gebeurtenis',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required().max(60).error('Titels zijn gelimiteerd tot maximaal 60 tekens')),
    },
    {
      title: 'Omschrijving',
      name: 'description',
      type: 'localeText',
      validation: REQUIRED,
    },
    {
      title: 'Level',
      name: 'level',
      type: 'number',
      validation: (rule: Rule) => REQUIRED_MIN_MAX(rule, THERMOMETER_MIN_VALUE, THERMOMETER_MAX_VALUE),
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
      title: 'Einddatum',
      name: 'dateEnd',
      type: 'date',
      options: {
        dateFormat: DATE_FORMAT,
      },
      validation: REQUIRED,
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
