import { Rule } from '~/sanity';
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
  fields: [
    {
      title: 'Hoeveel weken geleden was de startdatum?',
      name: 'weekOffset',
      type: 'number',
      validation: (rule: Rule) => rule.required().min(0),
    },
    {
      title: 'Op welke dag van de week start de datum?',
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
      description: '(1 dag of bereik van – tot)',
      name: 'timeSpanInDays',
      type: 'number',
      validation: (rule: Rule) => rule.required().min(1),
    },
  ],
};
