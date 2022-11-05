import { Rule } from '~/sanity';
import { KpiIconInput, KpiIconKey } from '../../components/portable-text/kpi-configuration/kpi-icon-input';

export const measurementTile = {
  type: 'document',
  title: 'Maatregelen tegel',
  name: 'measurementTile',
  fields: [
    {
      title: 'Tegel icoon',
      name: 'tileIcon',
      type: 'string',
      inputComponent: KpiIconInput,
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Omschrijving',
      name: 'description',
      type: 'localeRichContentBlock',
      validation: (rule: Rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'description.nl',
    },
  },
};