import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../validation';

const DAYS_OF_THE_WEEK_LIST = [
  {
    title: 'Zondag',
    value: 0,
  },
  {
    title: 'Maandag',
    value: 1,
  },
  {
    title: 'Dinsdag',
    value: 2,
  },
  {
    title: 'Woensdag',
    value: 3,
  },
  {
    title: 'Donderdag',
    value: 4,
  },
  {
    title: 'Vrijdag',
    value: 5,
  },
  {
    title: 'Zaterdag',
    value: 6,
  },
];

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
      type: 'number',
    },

    {
      title: 'Hoeveelheid dagen',
      name: 'timeSpanInDays',
      type: 'number',
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
