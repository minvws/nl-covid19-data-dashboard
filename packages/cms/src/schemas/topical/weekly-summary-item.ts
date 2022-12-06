import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../validation';

export const weeklySummaryItem = {
  type: 'document',
  title: 'Maatregelen tegel',
  name: 'weeklySummaryItem',
  fields: [
    {
      title: 'Tegel icoon',
      name: 'tileIcon',
      type: 'string',
      inputComponent: KpiIconInput,
      validation: REQUIRED,
    },
    {
      title: 'Omschrijving',
      name: 'description',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Bevat thermometer niveau',
      name: 'isThermometerMetric',
      type: 'boolean',
    },
  ],
  preview: {
    select: {
      title: 'description.nl',
    },
  },
};
