import { Rule } from '~/sanity';

export const THERMOMETER_LEVELS = [
  1,2,3,4
]

export const thermometerLevel = {
  type: 'document',
  title: 'Thermometer stand',
  name: 'thermometerLevel',
  fields: [
    {
      title: 'Stand',
      description: 'Wat is de hoogte van deze stand',
      name: 'level',
      type: 'number',
      options: {
        list: THERMOMETER_LEVELS,
        layout: 'dropdown',
      },
      validation: (rule: Rule) => rule.required().integer().max(4).min(1),
    },
    {
      title: 'Stand naam',
      name: 'label',
      type: 'localeString',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Omschrijving',
      name: 'description',
      type: 'localeRichContentBlock',
    },
  ],
  preview: {
    select: {
      title: 'label.nl',
      subtitle: 'level'
    },
    prepare(selection: { title: string; subtitle: string; }) {
      const {title, subtitle} = selection
      return {
        title: title,
        subtitle: `Stand ${subtitle}`
      }
    }
  },
};
