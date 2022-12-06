import { Rule } from '~/sanity';
import { SEVERITY_LEVELS_LIST } from '@corona-dashboard/app/src/components/severity-indicator-tile/constants';
import { REQUIRED, REQUIRED_MIN_MAX } from '../../validation';
import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';

export const THERMOMETER_MIN_VALUE = Math.min(...SEVERITY_LEVELS_LIST);
export const THERMOMETER_MAX_VALUE = Math.max(...SEVERITY_LEVELS_LIST);

export const thermometer = {
  type: 'object',
  title: 'Thermometer',
  name: 'thermometer',
  fields: [
    {
      title: 'Thermometer icoon',
      name: 'icon',
      type: 'string',
      inputComponent: KpiIconInput,
      validation: REQUIRED,
    },
    {
      title: 'De titel boven de thermometer',
      name: 'title',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'De beschrijving boven de thermometer',
      name: 'subTitle',
      type: 'localeRichContentBlock',
    },
    {
      title: 'De titel binnen de thermometer tegel',
      name: 'tileTitle',
      type: 'localeString',
    },
    {
      title: 'Huidige stand',
      name: 'currentLevel',
      type: 'number',
      options: {
        list: SEVERITY_LEVELS_LIST,
        layout: 'dropdown',
      },
      validation: (rule: Rule) => REQUIRED_MIN_MAX(rule, THERMOMETER_MIN_VALUE, THERMOMETER_MAX_VALUE),
    },
    {
      title: 'Standen',
      name: 'thermometerLevels',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'thermometerLevel' } }],
      validation: REQUIRED,
    },
    {
      title: 'Datum tekst',
      description: 'Van wanneer was deze stand',
      name: 'datesLabel',
      type: 'localeString',
    },
    {
      title: 'Huidige stand omschrijvig',
      description: 'De omschrijving spcifiek voor de huidige themrmometer stand bij de trendIcon',
      name: 'levelDescription',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Bron tekst',
      name: 'sourceLabel',
      type: 'localeString',
    },
    {
      title: 'Artikel referentie',
      name: 'articleReference',
      type: 'localeRichContentBlock',
    },
    {
      title: 'Titel van uitklapbare sectie',
      name: 'collapsibleTitle',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Titel van standen informatie',
      name: 'trendIcon',
      type: 'trendIcon',
    },
    {
      title: 'Tijdlijn',
      name: 'timeline',
      type: 'thermometerTimeline',
      validation: REQUIRED,
    },
  ],
};
