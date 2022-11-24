import { KpiIconInput as MeasuresIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../validation';

export const measures = {
  type: 'document',
  title: 'Geldende adviezen',
  name: 'measures',
  fields: [
    {
      title: 'Pagina icoon',
      name: 'icon',
      type: 'string',
      inputComponent: MeasuresIconInput,
      validation: REQUIRED,
    },
    {
      title: 'Titel van de pagina',
      name: 'title',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Omschrijving van de pagina',
      name: 'description',
      type: 'localeRichContentBlock',
    },
    {
      title: 'Groepen',
      description: 'De maatregelen zijn onderverdeeld in groepen',
      name: 'measuresCollection',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'measuresCollection' } }],
    },
  ],
};
