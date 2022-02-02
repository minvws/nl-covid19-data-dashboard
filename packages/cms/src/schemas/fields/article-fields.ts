import { Rule } from '~/sanity';
import {
  localeStringValidation,
  localeValidation,
} from '../../language/locale-validation';

const REQUIRED_FIELD_WARNING = 'Dit veld is verplicht.';

export const ARTICLE_FIELDS = [
  {
    title: 'Titel',
    name: 'title',
    type: 'localeString',
    validation: localeStringValidation((rule) =>
      rule.required().warning(REQUIRED_FIELD_WARNING)
    ),
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
    validation: localeStringValidation((rule) =>
      rule.required().warning(REQUIRED_FIELD_WARNING)
    ),
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
    validation: (rule: Rule) => rule.required().warning(REQUIRED_FIELD_WARNING),
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
    validation: (rule: Rule) =>
      rule.required().min(1).warning(REQUIRED_FIELD_WARNING),
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
    validation: localeValidation((rule) =>
      rule.required().warning(REQUIRED_FIELD_WARNING)
    ),
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
    title: 'Content',
    name: 'content',
    type: 'localeRichContentBlock',
    validation: localeValidation((rule) =>
      rule.required().warning(REQUIRED_FIELD_WARNING)
    ),
  },
];
