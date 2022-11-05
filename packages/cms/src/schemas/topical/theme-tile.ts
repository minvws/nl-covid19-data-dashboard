import { Rule } from '~/sanity';
import { SanityDocument } from '@sanity/types'
import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';

export const themeTile = {
  type: 'document',
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
      validation: (rule: Rule) => rule.required(),
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
      type: 'localeRichContentBlock',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'KPI waarde',
      name: 'kpiValue',
      type: 'localeString',
    },
    {
      title: 'Trend icon',
      name: 'trendIcon',
      type: 'trendIcon',
    },
    {
      title: 'Call to action',
      name: 'cta',
      type: 'link',
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'index'
    },
    prepare(selection: { title: string; subtitle: string; }) {
      const {title, subtitle} = selection
      return {
        title: title,
        subtitle: `${subtitle} is de index van dit thema`
      }
    }
  },
};