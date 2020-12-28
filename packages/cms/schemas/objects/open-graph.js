export default {
  title: "SEO instellingen",
  name: "openGraph",
  type: "object",
  fields: [
    {
      title: "Titel",
      name: "title",
      type: "string",
      description: "Titel van de website of pagina",
      validation: (Rule) =>
        Rule.max(60).warning("Titel moet onder 60 karakters zijn"),
    },
    {
      title: "Beschrijving",
      name: "description",
      type: "text",
      description: "Beschrijving van de website of pagina",
      validation: (Rule) =>
        Rule.max(155).warning(
          "Beschrijving moet minder dan 155 karakters zijn"
        ),
    },
  ],
  preview: {
    select: {
      title: "title",
      route: "route.slug.current",
      link: "link",
    },
    prepare({ title, route, link }) {
      return {
        title,
        subtitle: route
          ? `Route: /${route}/`
          : link
          ? `External link: ${link}`
          : "Not set",
      };
    },
  },
};
