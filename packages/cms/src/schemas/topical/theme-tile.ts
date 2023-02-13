import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../validation';
import { TopicalTileDate } from '../../components/topical-tile-date';
import { supportedLanguages } from '../../language/supported-languages';

export const themeTile = {
  type: 'document',
  title: 'Thema tegel',
  name: 'themeTile',
  fieldsets: [
    {
      title: 'KPI Waarde',
      name: 'kpiValue',
    },
    {
      title: 'Theme tegel datum configuratie',
      name: 'theme-tile-date-config',
      description: 'Klik op het label om de velden te tonen.',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: REQUIRED,
    },
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
    {
      title: 'KPI waarde',
      name: 'kpiValue',
      type: 'localeString',
      fieldset: 'kpiValue',
    },
    {
      title: 'Verberg trend icoon',
      name: 'hideTrendIcon',
      type: 'boolean',
      description: 'Wanneer aangevinkt, wordt het trend icoon niet getoond bij de KPI waarde.',
      fieldset: 'kpiValue',
      initialValue: false,
    },
    {
      title: 'Metadata label',
      description: `Deze tekst wordt gebruikt inplaats van de variabele {{date}}:`,
      name: 'sourceLabel',
      type: 'localeString',
    },
    {
      title: 'Tegel datum',
      name: 'tileDate',
      type: 'object',
      fields: supportedLanguages.map((lang) => ({
        title: lang.title,
        name: lang.id,
        type: 'string',
        inputComponent: TopicalTileDate,
      })),
    },
    {
      title: 'Configuratie velden',
      description: 'Voor de start en eind datum van deze tegel op de samenvattingspagina.',
      name: 'themeTileDateConfig',
      type: 'themeTileDateConfig',
      fieldset: 'theme-tile-date-config',
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
    },
  },
};
