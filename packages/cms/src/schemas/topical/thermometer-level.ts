import { Rule } from '~/sanity';

import { THERMOMETER_LEVELS, THERMOMETER_MIN_VALUE, THERMOMETER_MAX_VALUE } from './thermometer';
import { REQUIRED, REQUIRED_MIN_MAX } from '../../validation';

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
      validation: (rule: Rule) => REQUIRED_MIN_MAX(rule, THERMOMETER_MIN_VALUE, THERMOMETER_MAX_VALUE),
    },
    {
      title: 'Stand naam',
      name: 'label',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: REQUIRED,
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
      subtitle: 'level',
    },
    prepare(selection: { title: string; subtitle: string }) {
      const { title, subtitle } = selection;
      return {
        title: title,
        subtitle: `Stand ${subtitle}`,
      };
    },
  },
};
