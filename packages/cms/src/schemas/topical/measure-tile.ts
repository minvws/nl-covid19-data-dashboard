import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../validation';

export const measureTile = {
  type: 'document',
  title: 'Maatregelen tegel',
  name: 'measureTile',
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
      type: 'localeRichContentBlock',
      validation: REQUIRED,
    },
  ],
  preview: {
    select: {
      title: 'description.nl',
    },
  },
};