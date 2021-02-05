export const ARTICLE_FIELDS = [
  {
    title: 'Titel',
    name: 'title',
    type: 'localeString',
    validation: (Rule) =>
      Rule.fields({
        nl: (fieldRule) => fieldRule.reset().required(),
        en: (fieldRule) => fieldRule.reset().required(),
      }),
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
    validation: (Rule) =>
      Rule.fields({
        nl: (fieldRule) => fieldRule.reset().required(),
        en: (fieldRule) => fieldRule.reset().required(),
      }),
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
    validation: (Rule) => Rule.required(),
  },
  {
    title: 'Samenvatting',
    description:
      'Dit is een korte samenvatting van het artikel die getoond wordt in de artikelblokken op de overzichtspagina.',
    name: 'summary',
    type: 'localeText',
    validation: (Rule) =>
      Rule.fields({
        nl: (fieldRule) => fieldRule.reset().required().max(120),
        en: (fieldRule) => fieldRule.reset().required().max(120),
      }),
  },
  {
    title: 'Intro',
    name: 'intro',
    type: 'localeBlock',
    validation: (Rule) =>
      Rule.fields({
        nl: (fieldRule) => fieldRule.reset().required(),
        en: (fieldRule) => fieldRule.reset().required(),
      }),
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
    validation: (Rule) => Rule.required(),
  },
  {
    title: 'Content',
    name: 'content',
    type: 'localeRichContentBlock',
    validation: (Rule) =>
      Rule.fields({
        nl: (fieldRule) => fieldRule.reset().required(),
        en: (fieldRule) => fieldRule.reset().required(),
      }),
  },
];
