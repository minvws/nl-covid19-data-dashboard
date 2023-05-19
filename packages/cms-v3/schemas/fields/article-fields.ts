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
    title: 'Categorieën instellen',
    name: 'categories',
    type: 'array',
    of: [defineArrayMember({ type: 'string' })],
    options: {
      layout: 'grid',
      list: [
        { title: 'Vaccinaties', value: 'vaccinaties' },
        { title: 'Besmettingen', value: 'besmettingen' },
        { title: 'Sterfte', value: 'sterfte' },
        { title: 'Ziekenhuizen', value: 'ziekenhuizen' },
        { title: 'Kwetsbare groepen', value: 'kwetsbare_groepen' },
        { title: 'Vroege indicatoren', value: 'vroege_indicatoren' },
        { title: 'Gedrag', value: 'gedrag' },
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
