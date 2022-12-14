import { SEVERITY_LEVELS_LIST } from '@corona-dashboard/app/src/components/severity-indicator-tile/constants';
import { isDefined } from 'ts-is-present';
import { REQUIRED } from '../../validation';

const DATE_FORMAT = 'YYYY-MM-DD';

export const thermometerTimelineEvent = {
  name: 'thermometerTimelineEvent',
  type: 'document',
  title: 'Thermometer tijdlijn gebeurtenis',
  fields: [
    {
      title: 'Level',
      name: 'level',
      type: 'number',
      options: {
        list: SEVERITY_LEVELS_LIST,
        layout: 'dropdown',
      },
      validation: REQUIRED,
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
