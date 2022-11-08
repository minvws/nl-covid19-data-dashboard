import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../validation';

export const theme = {
  type: 'document',
  title: 'Thema',
  name: 'theme',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Ondertitel',
      name: 'subTitle',
      type: 'localeString',
    },
    {
      title: 'Thema icoon',
      name: 'themeIcon',
      type: 'string',
      inputComponent: KpiIconInput,
      validation: REQUIRED,
    },
    {
      title: 'Tegels',
      name: 'tiles',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'themeTile' } }],
      validation: REQUIRED,
    },
    {
      title: 'Links label',
      name: 'linksLabel',
      type: 'localeString',
    },
    {
      title: 'Links',
      name: 'links',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'themeLink' } }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
    },
  },
};
