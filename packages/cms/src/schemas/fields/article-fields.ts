import { Rule } from '~/sanity';
import { localeStringValidation, localeValidation } from '../../language/locale-validation';

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
    validation: (rule: Rule) => rule.required(),
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
    title: 'Categorieën instellen',
    name: 'categories',
    type: 'array',
    of: [{ type: 'string' }],
    options: {
      layout: 'grid',
      list: [
        { title: 'Vaccinaties', value: 'vaccinaties' },
        { title: 'besmettingen', value: 'besmettingen' },
        { title: 'Sterfte', value: 'sterfte' },
        { title: 'Ziekenhuizen', value: 'ziekenhuizen' },
        { title: 'Kwetsbare groepen', value: 'kwetsbare_groepen' },
        { title: 'Vroege indicatoren', value: 'vroege_indicatoren' },
        { title: 'Gedrag', value: 'gedrag' },
      ],
    },
    validation: (rule: Rule) => rule.required().min(1),
  },
  {
    title: 'Samenvatting',
    description: 'Dit is een korte samenvatting van het artikel die getoond wordt in de artikelblokken op de overzichtspagina. Maximaal 120 karakters toegestaan.',
    name: 'summary',
    type: 'localeText',
    validation: localeValidation((rule) => rule.required().max(120)),
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
    validation: (rule: Rule) =>
      rule
        .custom((context: any) => {
          return context.asset ? true : 'Image required';
        })
        .required(),
  },
  {
    title: 'Afbeelding voor grote schermen',
    name: 'imageDesktop',
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
  },
  {
    title: 'Afbeelding voor kleine schermen',
    name: 'imageMobile',
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
  },
  {
    title: 'Content',
    name: 'content',
    type: 'localeRichContentBlock',
    validation: localeValidation((rule) => rule.required()),
  },
];
