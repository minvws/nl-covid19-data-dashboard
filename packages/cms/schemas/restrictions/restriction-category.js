export default {
  title: "Restrictie Categorie",
  name: "restrictionCategory",
  type: "object",
  fields: [
    {
      title: "Titel van groep",
      description: "Hoe noem je deze groep maatregelen?",
      name: "title",
      type: "localeString",
    },
    {
      title: "Maatregelen",
      description: "Per groep bestaat er een lijst maatregelen",
      name: "restrictions",
      type: "array",
      of: [{ type: "restrictionGroup" }],
    },
  ],
  preview: {
    select: {
      title: "title.nl",
    },
  },
};
