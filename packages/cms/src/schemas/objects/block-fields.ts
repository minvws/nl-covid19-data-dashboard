import { MdAttachFile, MdLink } from 'react-icons/md';
import { Rule } from '~/sanity';

export const blockFields = [
  {
    type: 'block',

    // Only allow these block styles
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'H2', value: 'h2' },
      { title: 'H3', value: 'h3' },
      { title: 'Quote', value: 'blockquote' },
    ],
    lists: [
      { title: 'Bullet', value: 'bullet' },
      { title: 'Numbered', value: 'number' },
    ],
    marks: {
      // Only allow these decorators
      decorators: [
        { title: 'Strong', value: 'strong' },
        { title: 'Emphasis', value: 'em' },
        { title: 'Underline', value: 'u' },
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'External link',
          icon: MdLink,
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
            },
          ],
        },
        {
          name: 'inlineAttachment',
          type: 'file',
          title: 'Bestand uploaden',
          icon: MdAttachFile,
        },
      ],
    },
  },
  {
    type: 'image',
    initialValue: {
      isFullWidth: true,
    },
    fields: [
      {
        name: 'alt',
        title: 'Alternatieve tekst (toegankelijkheid)',
        type: 'string',
        validation: (rule: Rule) => rule.required(),
        options: {
          isHighlighted: true,
        },
      },
      {
        name: 'isFullWidth',
        title: 'Afbeelding breed weergeven?',
        type: 'boolean',
      },
      {
        name: 'caption',
        title: 'Onderschrift',
        type: 'text',
      },
    ],
  },
  {
    type: 'inlineCollapsible',
    title: 'Inklapbaar blok',
  },
  {
    title: 'Dashboard Grafiek',
    name: 'dashboardChart',
    type: 'reference',
    to: [{ type: 'chartConfiguration' }],
  },
  {
    title: 'Dashboard KPIs',
    name: 'dashboardKpi',
    type: 'reference',
    to: [{ type: 'kpiConfiguration' }],
  },
];
