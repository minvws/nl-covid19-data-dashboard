import { defineArrayMember, defineField, defineType } from 'sanity';
import { IconInput } from '../../../../components/icon-input';
import { SEVERITY_LEVELS_LIST } from '../../../../studio/constants';
import { localeStringValidation } from '../../../../studio/validation/locale-validation';

export const thermometer = defineType({
  type: 'object',
  title: 'Thermometer',
  name: 'thermometer',
  fieldsets: [
    {
      title: 'Artikel referentie',
      name: 'artikel-referentie',
      description: 'Klik op het label om de velden te tonen.',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    defineField({
      title: 'Thermometer icoon',
      name: 'icon',
      type: 'string',
      validation: (rule) => rule.required(),
      components: {
        input: IconInput,
      },
    }),
    defineField({
      title: 'De titel boven de thermometer',
      name: 'title',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'De titel binnen de thermometer tegel',
      name: 'tileTitle',
      type: 'localeString',
    }),
    defineField({
      title: 'Huidige stand',
      name: 'currentLevel',
      type: 'number',
      options: {
        list: SEVERITY_LEVELS_LIST,
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Standen',
      name: 'thermometerLevels',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'thermometerLevel' } })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      title: 'Datum tekst',
      description: 'Van wanneer was deze stand',
      name: 'datesLabel',
      type: 'localeString',
    }),
    defineField({
      title: 'Huidige stand omschrijving',
      description: 'De omschrijving specifiek voor de huidige thermometer stand bij de trendIcon',
      name: 'levelDescription',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Bron tekst',
      name: 'sourceLabel',
      type: 'localeString',
    }),
    defineField({
      title: 'Artikel referentie',
      name: 'articleReference',
      type: 'localeRichContentBlock',
      fieldset: 'artikel-referentie',
    }),
    defineField({
      title: 'Titel van standen sectie',
      name: 'collapsibleTitle',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Tijdlijn',
      name: 'timeline',
      type: 'thermometerTimeline',
      validation: (rule) => rule.required(),
    }),
  ],
});
