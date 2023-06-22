import { defineField, defineType } from 'sanity';
import { DATE_FORMAT, SEVERITY_LEVELS_LIST, thermometerLevelPreviewMedia } from '../../../../studio/constants';

export const thermometerTimelineEvent = defineType({
  name: 'thermometerTimelineEvent',
  type: 'document',
  title: 'Thermometer tijdlijn gebeurtenis',
  fields: [
    defineField({
      title: 'Level',
      name: 'level',
      type: 'number',
      options: {
        list: SEVERITY_LEVELS_LIST,
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
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
      title: 'Einddatum',
      name: 'dateEnd',
      type: 'date',
      options: {
        dateFormat: DATE_FORMAT,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'level',
      date: 'date',
      dateEnd: 'dateEnd',
    },
    prepare(value) {
      const { title, date, dateEnd }: { title: number; date: string; dateEnd: string } = value;

      // Construct a custom start date
      const [year, month, day] = date.split('-');

      return {
        title: `${day}/${month}/${year}: Stand ${title}`,
        subtitle: [date, dateEnd].join(' tot '),
        media: thermometerLevelPreviewMedia[title - 1],
      };
    },
  },
});
