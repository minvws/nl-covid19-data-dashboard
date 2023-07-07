import { defineField, defineType } from 'sanity';
import { IconInput } from '../../../../components/icon-input';
import { BsFileEarmark } from 'react-icons/bs';

export const summaryItem = defineType({
  type: 'document',
  title: 'Maatregelen tegel',
  name: 'weeklySummaryItem',
  icon: BsFileEarmark,
  fields: [
    defineField({
      title: 'Tegel icoon',
      name: 'tileIcon',
      type: 'string',
      validation: (rule) => rule.required(),
      components: {
        input: IconInput,
      },
    }),
    defineField({
      title: 'Omschrijving',
      name: 'description',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Bevat thermometer niveau',
      name: 'isThermometerMetric',
      type: 'boolean',
    }),
  ],
  preview: {
    select: {
      title: 'description.nl',
    },
  },
});
