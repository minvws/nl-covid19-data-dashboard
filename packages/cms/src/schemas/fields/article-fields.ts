export const ARTICLE_FIELDS = [
  {
    title: 'Titel',
    name: 'title',
    type: 'localeString',
    validation: (Rule: any) =>
      Rule.fields({
        nl: (fieldRule: any) => fieldRule.reset().required(),
        en: (fieldRule: any) => fieldRule.reset().required(),
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
    validation: (Rule: any) =>
      Rule.fields({
        nl: (fieldRule: any) => fieldRule.reset().required(),
        en: (fieldRule: any) => fieldRule.reset().required(),
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
    validation: (Rule: any) => Rule.required(),
  },
  {
    title: 'Samenvatting',
    description:
      'Dit is een korte samenvatting van het artikel die getoond wordt in de artikelblokken op de overzichtspagina.',
    name: 'summary',
    type: 'localeText',
    validation: (Rule: any) =>
      Rule.fields({
        nl: (fieldRule: any) => fieldRule.reset().required().max(120),
        en: (fieldRule: any) => fieldRule.reset().required().max(120),
      }),
  },
  {
    title: 'Intro',
    name: 'intro',
    type: 'localeBlock',
    validation: (Rule: any) =>
      Rule.fields({
        nl: (fieldRule: any) => fieldRule.reset().required(),
        en: (fieldRule: any) => fieldRule.reset().required(),
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
    validation: (Rule: any) => Rule.required(),
  },
  {
    title: 'Content',
    name: 'content',
    type: 'localeRichContentBlock',
    validation: (Rule: any) =>
      Rule.fields({
        nl: (fieldRule: any) => fieldRule.reset().required(),
        en: (fieldRule: any) => fieldRule.reset().required(),
      }),
  },
];
