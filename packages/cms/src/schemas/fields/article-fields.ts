import { defineArrayMember, defineField } from 'sanity';
import { localeStringValidation, localeValidation } from '../../studio/validation/locale-validation';
import { DATE_FORMAT, TIME_FORMAT } from '../../studio/constants';

export const ARTICLE_FIELDS = [
  defineField({
    title: 'Titel',
    name: 'title',
    type: 'localeString',
    validation: localeStringValidation((rule) => rule.required()),
  }),
  defineField({
    title: 'Slug',
    name: 'slug',
    type: 'slug',
    options: {
      source: 'title.nl',
    },
    fieldset: 'metadata',
    validation: (rule) => rule.required(),
  }),
  defineField({
    title: 'Meta description',
    name: 'metaDescription',
    type: 'localeString',
    fieldset: 'metadata',
    validation: localeStringValidation((rule) => rule.required()),
  }),
  defineField({
    title: 'Publicatie datum',
    name: 'publicationDate',
    type: 'datetime',
    options: {
      dateFormat: DATE_FORMAT,
      timeFormat: TIME_FORMAT,
      timeStep: 15,
    },
    fieldset: 'metadata',
    validation: (rule) => rule.required(),
  }),
  defineField({
    title: 'Hoofdcategorie',
    name: 'mainCategory',
    type: 'string',
    options: {
      layout: 'radio',
      list: [
        { title: 'Kennisartikelen', value: 'knowledge' },
        { title: 'Nieuwsartikelen', value: 'news' },
      ],
    },
    validation: (rule) => rule.required(),
  }),
  defineField({
    title: 'Update datum',
    name: 'updatedDate',
    type: 'datetime',
    description:
      'Dit veld moet worden ingevuld wanneer een "kennis" artikel wordt bijgewerkt, zodat de datum op het dashboard de bijgewerkte datum weergeeft in plaats van de oorspronkelijke publicatiedatum. Als dit veld niet wordt bijgewerkt, blijft de publicatiedatum zichtbaar.',
    options: {
      dateFormat: DATE_FORMAT,
      timeFormat: TIME_FORMAT,
      timeStep: 15,
    },
    hidden: ({ parent }) => !parent?.mainCategory?.includes('knowledge'),
  }),
  defineField({
    title: 'Categorieën instellen',
    name: 'categories',
    type: 'array',
    of: [defineArrayMember({ type: 'string' })],
    options: {
      layout: 'grid',
      list: [
        { title: 'Besmettingen', value: 'besmettingen' },
        { title: 'Gedrag', value: 'gedrag' },
        { title: 'Kwetsbare groepen', value: 'kwetsbare_groepen' },
        { title: 'Sterfte', value: 'sterfte' },
        { title: 'Vaccinaties', value: 'vaccinaties' },
        { title: 'Vroege indicatoren', value: 'vroege_indicatoren' },
        { title: 'Ziekenhuizen', value: 'ziekenhuizen' },
      ],
    },
    validation: (rule) => rule.required().min(1),
  }),
  defineField({
    title: 'Samenvatting',
    description: 'Dit is een korte samenvatting van het artikel die getoond wordt in de artikelblokken op de overzichtspagina. Maximaal 120 karakters toegestaan.',
    name: 'summary',
    type: 'localeText',
    validation: localeValidation((rule) => rule.required().max(120)),
  }),
  defineField({
    title: 'Intro',
    name: 'intro',
    type: 'localeBlock',
    validation: localeValidation((rule) => rule.required()),
  }),
  defineField({
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
    validation: (rule) =>
      rule
        .custom((context: any) => {
          return context.asset ? true : 'Image required';
        })
        .required(),
  }),
  defineField({
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
        validation: localeStringValidation((rule) => rule.required()),
      },
    ],
  }),
  defineField({
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
        validation: localeStringValidation((rule) => rule.required()),
      },
    ],
  }),
  defineField({
    title: 'Content',
    name: 'content',
    type: 'localeRichContentBlock',
    validation: localeValidation((rule) => rule.required()),
  }),
];
