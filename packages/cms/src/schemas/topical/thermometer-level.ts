import { Rule } from '~/sanity';

export const THERMOMETER_LEVELS = [
  1,2,3,4
]

export const thermometerLevel = {
  type: 'object',
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
      description: 'De naam van deze stand',
      name: 'label',
      type: 'localeString',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Titel',
      description: 'De titel voor deze stand',
      name: 'title',
      type: 'localeString',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Omschrijving',
      description: 'De omschrijving voor deze stand',
      name: 'description',
      type: 'localeString',
    },
  ],
};
