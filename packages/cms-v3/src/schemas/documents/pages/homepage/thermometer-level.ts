import { defineField, defineType } from 'sanity';
import { SEVERITY_LEVELS_LIST, thermometerLevelPreviewMedia } from '../../../../studio/constants';
import { localeStringValidation } from '../../../../studio/validation/locale-validation';

export const thermometerLevel = defineType({
  type: 'document',
  title: 'Thermometer stand',
  name: 'thermometerLevel',
  fields: [
    defineField({
      title: 'Stand',
      description: 'Wat is de hoogte van deze stand',
      name: 'level',
      type: 'number',
      options: {
        list: SEVERITY_LEVELS_LIST,
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Stand naam',
      name: 'label',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Omschrijving',
      name: 'description',
      description: 'Dit is een markdown veld. De thermometer level kan gebruikt worden door **{{label}}** in de tekst te zetten.',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
  ],
  preview: {
    select: {
      title: 'label.nl',
      subtitle: 'level',
    },
    prepare(value) {
      const { title, subtitle }: { title: string; subtitle: string } = value;

      return {
        title,
        subtitle: `Stand ${subtitle}`,
        media: thermometerLevelPreviewMedia[parseInt(subtitle) - 1],
      };
    },
  },
});
