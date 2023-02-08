import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../validation';

const DAYS_OF_THE_WEEK_LIST = {
  0: 'Zondag',
  1: 'Maandag',
  2: 'Dinsdag',
  3: 'Woensdag',
  4: 'Donderdag',
  5: 'Vrijdag',
  6: 'Zaterdag',
};

export const themeTile = {
  type: 'document',
  title: 'Thema tegel',
  name: 'themeTile',
  fieldsets: [
    {
      title: 'KPI Waarde',
      name: 'kpiValue',
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
      name: 'sourceLabel',
      type: 'localeString',
    },

    {
      title: 'Iso week offset',
      name: 'isoWeekOffset',
      type: 'number',
    },
    {
      title: 'Dag van de week',
      name: 'startDayOfTheWeek',
      options: {
        list: DAYS_OF_THE_WEEK_LIST,
        layout: 'dropdown',
      },
      type: 'localeString',
    },

    {
      title: 'Hoeveelheid dagen',
      name: 'sourceLabel',
      type: 'localeString',
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
