import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../validation';

export const measureTheme = {
  type: 'object',
  title: 'Thema',
  name: 'measureTheme',
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
      type: 'localeRichContentBlock',
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
      of: [{ type: 'reference', to: { type: 'measureTile' } }],
      validation: REQUIRED,
    },
  ],
};
