import { defineField, defineType } from 'sanity';
import { DAYS_OF_THE_WEEK_LIST } from '../../../../studio/constants';

export const themeTileConfig = defineType({
  name: 'themeTileDateConfig',
  title: 'Thema tegel configuratie',
  type: 'document',
  fields: [
    defineField({
      title: 'Hoeveel weken geleden was de startdatum?',
      name: 'weekOffset',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Op welke dag van de week start de datum?',
      name: 'startDayOfDate',
      options: {
        list: DAYS_OF_THE_WEEK_LIST,
        layout: 'dropdown',
      },
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Hoeveelheid dagen',
      description: '(1 dag of bereik van - tot)',
      name: 'timeSpanInDays',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
  ],
});
