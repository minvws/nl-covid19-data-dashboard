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
      title: 'level',
      date: 'date',
      dateEnd: 'dateEnd',
    },
    prepare(selection: { title: number; date: string; dateEnd?: string }) {
      // Construct a custom start date
      const day = selection.date.slice(8);
      const month = selection.date.slice(5, -3);

      return {
        title: `${day}/${month}: level ${selection.title}`,
        subtitle: [selection.date, selection.dateEnd].filter(isDefined).join(' tot '),
      };
    },
  },
};
