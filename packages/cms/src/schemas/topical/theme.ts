import { Rule } from '~/sanity';
import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';

export const theme = {
  type: 'object',
  title: 'Thema',
  name: 'theme',
  fields: [
    {
      title: 'Index',
      name: 'index',
      type: 'number',
      validation: (rule: Rule) => rule.required(),
    },
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
      of: [{ type: 'reference', to: { type: 'themeTile' } }],
      validation: (rule: Rule) => rule.required(),
    },
  ],
};