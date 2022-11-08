import { Rule } from '~/sanity';
import { SeverityLevels } from '@corona-dashboard/app/src/components/severity-indicator-tile/types';
import { REQUIRED, REQUIRED_MIN_MAX } from '../../validation';

export const THERMOMETER_LEVELS = Object.values(SeverityLevels).map((severityLevel) => parseInt(severityLevel, 10));
export const THERMOMETER_MIN_VALUE = Math.min(...THERMOMETER_LEVELS);
export const THERMOMETER_MAX_VALUE = Math.max(...THERMOMETER_LEVELS);

export const thermometer = {
  type: 'object',
  title: 'Thermometer',
  name: 'thermometer',
  fields: [
    {
      title: 'De titel van de thermometer',
      name: 'title',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Huidige stand',
      name: 'currentLevel',
      type: 'number',
      options: {
        list: THERMOMETER_LEVELS,
        layout: 'dropdown',
      },
      validation: (rule: Rule) => REQUIRED_MIN_MAX(rule, THERMOMETER_MIN_VALUE, THERMOMETER_MAX_VALUE),
    },
    {
      title: 'Standen',
      name: 'thermometerLevels',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'thermometerLevel' } }],
      validation: REQUIRED
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
    },
    {
      title: 'Bron tekst',
      name: 'sourceLabel',
      type: 'localeString',
    },
    {
      title: 'Artikel referentie',
      name: 'articleReference',
      type: 'localeString',
    },
    {
      title: 'Titel van uitklapbare sectie',
      name: 'collapsibleTitle',
      type: 'localeString',
    },
    {
      title: 'Titel van standen informatie',
      name: 'trendIcon',
      type: 'trendIcon',
    },
    {
      title: 'Tijdlijn',
      name: 'timeline',
      type: 'thermometerTimeline'
    }
  ],
};