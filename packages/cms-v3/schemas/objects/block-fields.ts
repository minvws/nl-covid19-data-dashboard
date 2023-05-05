import { MdAttachFile, MdLink } from 'react-icons/md';
import { StringRule, UrlRule, defineArrayMember, defineField } from 'sanity';

export const blockFields = [
  defineArrayMember({
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
          title: 'Link',
          icon: MdLink,
          fields: [
            defineField({
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (rule: UrlRule) =>
                rule.uri({
                  allowRelative: true,
                  scheme: ['http', 'https', 'mailto'],
                }),
            }),
          ],
        },
        {
          name: 'inlineAttachment',
          type: 'file',
          title: 'Bestand uploaden',
          icon: MdAttachFile,
        },
        {
          name: 'richContentVariable',
          type: 'object',
          title: 'Rich content variable',
          fields: [
            defineField({
              name: 'Variable naam',
              type: 'string',
              title: 'variableName',
              hidden: true,
            }),
          ],
        },
      ],
    },
  }),
  defineArrayMember({
    type: 'image',
    initialValue: {
      isFullWidth: true,
    },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternatieve tekst (toegankelijkheid)',
        type: 'string',
        validation: (rule: StringRule) => rule.required(),
      }),
      defineField({
        name: 'isFullWidth',
        title: 'Afbeelding breed weergeven?',
        type: 'boolean',
      }),
      defineField({
        name: 'caption',
        title: 'Onderschrift',
        type: 'text',
      }),
    ],
  }),
  defineArrayMember({
    type: 'inlineCollapsible',
    title: 'Inklapbaar blok',
  }),
  defineArrayMember({
    title: 'Dashboard Lijn Grafiek',
    name: 'dashboardChart',
    type: 'object',
    fieldsets: [
      {
        title: 'Datum selectie',
        name: 'datespan',
        options: {
          collapsible: true,
          collapsed: true,
        },
      },
    ],
    fields: [
      defineField({
        title: 'Begin datum',
        name: 'startDate',
        type: 'date',
        fieldset: 'datespan',
      }),
      defineField({
        title: 'Eind datum',
        name: 'endDate',
        type: 'date',
        fieldset: 'datespan',
      }),
      defineField({
        name: 'title',
        type: 'string',
      }),
      defineField({
        name: 'config',
        type: 'reference',
        to: [{ type: 'chartConfiguration' }],
      }),
    ],
  }),
  defineArrayMember({
    title: 'Dashboard Donut Grafiek',
    name: 'dashboardDonut',
    type: 'object',
    fieldsets: [
      {
        title: 'Datum selectie',
        name: 'datespan',
        options: {
          collapsible: true,
          collapsed: true,
        },
      },
    ],
    fields: [
      defineField({
        title: 'Begin datum',
        name: 'startDate',
        type: 'date',
        fieldset: 'datespan',
      }),
      defineField({
        title: 'Eind datum',
        name: 'endDate',
        type: 'date',
        fieldset: 'datespan',
      }),
      defineField({
        name: 'title',
        type: 'string',
      }),
      defineField({
        name: 'config',
        type: 'reference',
        to: [{ type: 'donutChartConfiguration' }],
      }),
    ],
  }),
  defineArrayMember({
    title: 'Dashboard LeeftijdsGrafiek',
    name: 'dashboardAgeDemographicChart',
    type: 'object',
    fieldsets: [
      {
        title: 'Datum selectie',
        name: 'datespan',
        options: {
          collapsible: true,
          collapsed: true,
        },
      },
    ],
    fields: [
      defineField({
        title: 'Begin datum',
        name: 'startDate',
        type: 'date',
        fieldset: 'datespan',
      }),
      defineField({
        title: 'Eind datum',
        name: 'endDate',
        type: 'date',
        fieldset: 'datespan',
      }),
      defineField({
        name: 'title',
        type: 'string',
      }),
      defineField({
        name: 'config',
        type: 'reference',
        to: [{ type: 'ageDemographicChartConfiguration' }],
      }),
    ],
  }),
  defineArrayMember({
    title: 'Dashboard KPIs',
    name: 'dashboardKpi',
    type: 'object',
    fieldsets: [
      {
        title: 'Datum selectie',
        name: 'datespan',
        options: {
          collapsible: true,
          collapsed: true,
        },
      },
    ],
    fields: [
      defineField({
        title: 'Datum',
        name: 'endDate',
        type: 'date',
        fieldset: 'datespan',
      }),
      defineField({
        name: 'config',
        type: 'reference',
        to: [{ type: 'kpiConfiguration' }],
      }),
    ],
    preview: {
      select: {
        title: 'config.title',
      },
      prepare({ title }: { title: string }) {
        return {
          title,
        };
      },
    },
  }),
  defineArrayMember({
    title: 'Dashboard Choropleths',
    name: 'dashboardChoropleth',
    type: 'object',
    fields: [
      defineField({
        name: 'title',
        type: 'string',
      }),
      defineField({
        name: 'config',
        type: 'reference',
        to: [{ type: 'choroplethConfiguration' }],
      }),
    ],
    preview: {
      select: {
        title: 'config.title',
      },
      prepare({ title }: { title: string }) {
        return {
          title,
        };
      },
    },
  }),
];
