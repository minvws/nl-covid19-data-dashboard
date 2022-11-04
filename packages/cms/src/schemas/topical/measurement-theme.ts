import { Rule } from '~/sanity';
import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';

export const measurementTheme = {
  type: 'object',
  title: 'Thema',
  name: 'measurementTheme',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Ondertitel',
      name: 'subTitle',
      type: 'localeString',
    },
    {
      title: 'Thema icoon',
      name: 'tileIcon',
      type: 'string',
      inputComponent: KpiIconInput,
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Tegels',
      name: 'tiles',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'measurementTile' } }],
      validation: (rule: Rule) => rule.required(),
    },
  ],
};