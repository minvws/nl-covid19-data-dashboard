
import { Rule } from '~/sanity';
import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';

export const themeTile = {
  type: 'object',
  title: 'Thema tegel',
  name: 'themeTile',
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
    },
    {
      title: 'Trend icon',
      name: 'trendIcon',
      type: 'trendIcon',
    },
    {
      title: 'KPI waarde',
      name: 'kpiValue',
      type: 'localeString',
    },
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
      type: 'localeString',
    },
    {
      title: 'Call to action',
      name: 'cta',
      type: 'link',
    },
  ],
};