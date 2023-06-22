import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../validation';

export const weeklySummary = {
  type: 'object',
  title: 'Thema',
  name: 'weeklySummary',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Onderdelen',
      name: 'items',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'weeklySummaryItem' } }],
      validation: REQUIRED,
    },
  ],
};
