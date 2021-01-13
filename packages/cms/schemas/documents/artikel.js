export default {
  title: "Artikel",
  name: "artikel",
  type: "document",
  fieldsets: [
    {
      name: "metadata",
      title: "Metadata",
      options: {
        collapsible: true,
        collapsed: true
      }
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
        source: "title.nl"
      },
      fieldset: "metadata",
    },
    {
      title: "Meta description",
      name: "metaDescription",
      type: "localeString",
      fieldset: "metadata"
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
      title: "Intro",
      name: "intro",
      type: "localeBlock"
    },
    {
      title: "Afbeelding",
      name: "cover",
      type: "image"
    },
    {
      title: "Content",
      name: "content",
      type: "localeRichContentBlock"
    }
  ],
  preview: {
    select: {
      title: "title.nl",
      subtitle: "publicationDate",
    },
  },
}