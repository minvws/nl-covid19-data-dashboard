import { REQUIRED } from '../../validation';

const DAYS_OF_THE_WEEK_LIST = [
  {
    title: 'Zondag',
    value: 0,
  },
  {
    title: 'Maandag',
    value: 1,
  },
  {
    title: 'Dinsdag',
    value: 2,
  },
  {
    title: 'Woensdag',
    value: 3,
  },
  {
    title: 'Donderdag',
    value: 4,
  },
  {
    title: 'Vrijdag',
    value: 5,
  },
  {
    title: 'Zaterdag',
    value: 6,
  },
];

export const themeTileDateConfig = {
  name: 'themeTileDateConfig',
  type: 'document',
  title: 'Trend icon',
  fields: [
    {
      title: 'Iso week offset',
      name: 'isoWeekOffset',
      type: 'number',
      validation: REQUIRED,
    },
    {
      title: 'Dag van de week',
      name: 'startDayOfDate',
      options: {
        list: DAYS_OF_THE_WEEK_LIST,
        layout: 'dropdown',
      },
      type: 'number',
      validation: REQUIRED,
    },
    {
      title: 'Hoeveelheid dagen',
      name: 'timeSpanInDays',
      type: 'number',
      validation: REQUIRED,
    },
  ],
};
