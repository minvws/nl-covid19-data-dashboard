export default {
  title: "Artikel",
  name: "article",
  type: "document",
  fieldsets: [
    {
      title: "Metadata",
      name: "metadata",
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    {
      title: "Titel",
      name: "title",
      type: "localeString",
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      options: {
        source: "title.nl",
      },
      fieldset: "metadata",
    },
    {
      title: "Meta description",
      name: "metaDescription",
      type: "localeString",
      fieldset: "metadata",
    },
    {
      title: "Publicatie datum",
      name: "publicationDate",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        timeStep: 15,
        calendarTodayLabel: "Today",
      },
      fieldset: "metadata",
    },
    {
      title: "Samenvatting",
      description:
        "Dit is een korte samenvatting van het artikel die getoond wordt in de artikelblokken op de overzichtspagina.",
      name: "summary",
      type: "localeText",
      validation: (Rule) =>
        Rule.fields({
          nl: (fieldRule) => fieldRule.required().max(120),
          en: (fieldRule) => fieldRule.required().max(120),
        }),
    },
    {
      title: "Intro",
      name: "intro",
      type: "localeBlock",
    },
    {
      title: "Afbeelding",
      name: "cover",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          title: "Alternatieve tekst (toegankelijkheid)",
          name: "alt",
          type: "localeString",
        },
      ],
    },
    {
      title: "Content",
      name: "content",
      type: "localeRichContentBlock",
    },
  ],
  preview: {
    select: {
      title: "title.nl",
      subtitle: "publicationDate",
      media: "cover",
    },
  },
};
