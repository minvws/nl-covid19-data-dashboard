import { Rule } from '~/sanity';
import {THERMOMETER_LEVELS} from './thermometer-level';

export const thermometer = {
  type: 'object',
  title: 'Thermometer',
  name: 'thermometer',
  fields: [
    {
      title: 'De titel van de thermometer',
      description: 'Dit is de titel boven aan de sectie op de pagina',
      name: 'title',
      type: 'localeString',
      validation: (rule: Rule) => rule.required(),
    },
    {
      title: 'Huidige stand',
      description: 'Wat is de huidige stand',
      name: 'currentLevel',
      type: 'number',
      options: {
        list: THERMOMETER_LEVELS,
        layout: 'dropdown',
      },
      validation: (rule: Rule) => rule.required().integer().max(4).min(1),
    },
    {
      title: 'Standen',
      description: 'De thermometer standen',
      name: 'thermometerLevels',
      type: 'array',
      of: [{ type: 'thermometerLevel' }],
      validation: (rule: Rule) => rule.required(),
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
      description: 'Wat',
      name: 'sourceLabel',
      type: 'localeString',
    },
    {
      title: 'Artikel referentie',
      description: 'Wat',
      name: 'articleReference',
      type: 'localeString',
    },
    {
      title: 'Titel van standen informatie',
      description: 'Wat',
      name: 'collapsibleTitle',
      type: 'localeString',
    },
    {
      title: 'Titel van standen informatie',
      description: 'Wat',
      name: 'timeline',
      type: 'thermometerTimeline',
    },
    {
      title: 'Titel van standen informatie',
      description: 'Wat',
      name: 'trendIcon',
      type: 'trendIcon',
    },
  ],
};