import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../validation';

export const theme = {
  type: 'document',
  title: 'Thema',
  name: 'theme',
  fieldsets: [
    {
      title: 'Ondertitel',
      description: 'Klik op het label om de velden te tonen.',
      name: 'ondertitel',
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
      title: 'Ondertitel',
      name: 'subTitle',
      type: 'localeRichContentBlock',
      fieldset: 'ondertitel',
    },
    {
      title: 'Thema icoon',
      name: 'themeIcon',
      type: 'string',
      inputComponent: KpiIconInput,
      validation: REQUIRED,
    },
    {
      title: 'Tegels',
      name: 'tiles',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'themeTile' } }],
      validation: REQUIRED,
    },
    {
      title: 'Label voor mobiel',
      name: 'labelMobile',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Label voor desktop',
      name: 'labelDesktop',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Links',
      name: 'links',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'themeLink' } }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
    },
  },
};
