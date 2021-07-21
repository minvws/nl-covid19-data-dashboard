import { Rule } from '~/sanity';
import {
  localeStringValidation,
  localeValidation,
} from '../../language/locale-validation';

export const ARTICLE_FIELDS = [
  {
    title: 'Titel',
    name: 'title',
    type: 'localeString',
    validation: localeStringValidation((rule) => rule.required()),
  },
  {
    title: 'Slug',
    name: 'slug',
    type: 'slug',
    options: {
      source: 'title.nl',
    },
    fieldset: 'metadata',
  },
  {
    title: 'Meta description',
    name: 'metaDescription',
    type: 'localeString',
    fieldset: 'metadata',
    validation: localeStringValidation((rule) => rule.required()),
  },
  {
    title: 'Publicatie datum',
    name: 'publicationDate',
    type: 'datetime',
    options: {
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm',
      timeStep: 15,
      calendarTodayLabel: 'Today',
    },
    fieldset: 'metadata',
    validation: (rule: Rule) => rule.required(),
  },
  {
    title: 'Samenvatting',
    description:
      'Dit is een korte samenvatting van het artikel die getoond wordt in de artikelblokken op de overzichtspagina.',
    name: 'summary',
    type: 'localeText',
    // @Todo Align with content team about migrating content, and then enforce max length of 120.
    validation: localeValidation((rule) => rule.required()),
  },
  {
    title: 'Intro',
    name: 'intro',
    type: 'localeBlock',
    validation: localeValidation((rule) => rule.required()),
  },
  {
    title: 'Afbeelding',
    name: 'cover',
    type: 'image',
    options: {
      hotspot: true,
    },
    fields: [
      {
        title: 'Alternatieve tekst (toegankelijkheid)',
        name: 'alt',
        type: 'localeString',
      },
    ],
    validation: (rule: Rule) => rule.required(),
  },
  {
    title: 'Content',
    name: 'content',
    type: 'localeRichContentBlock',
    validation: localeValidation((rule) => rule.required()),
  },
];
