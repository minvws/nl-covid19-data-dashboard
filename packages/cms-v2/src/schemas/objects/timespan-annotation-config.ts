import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';

export const TimespanAnnotationConfig = {
  title: 'Dashboard Grafiek Timespan annotatie',
  name: 'timespanAnnotationConfig',
  type: 'object',
  fields: [
    {
      title: 'Fill waarde',
      name: 'fill',
      type: 'string',
      options: {
        list: [
          { title: 'Solid', value: 'solid' },
          { title: 'Hatched', value: 'hatched' },
          { title: 'Dotted', value: 'dotted' },
        ],
        layout: 'dropdown',
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Start index',
      name: 'start',
      type: 'number',
    },
    {
      title: 'End',
      name: 'end',
      type: 'number',
      validation: (rule: Rule) =>
        rule.custom((value: number, context: any) => {
          if (context.parent?.start < 0 && isDefined(value)) {
            return 'End value is not used when start value is less than zero';
          }
          return true;
        }),
    },
    {
      title: 'Label key',
      name: 'labelKey',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Short label key',
      name: 'shortLabelKey',
      type: 'string',
    },
  ],
};
