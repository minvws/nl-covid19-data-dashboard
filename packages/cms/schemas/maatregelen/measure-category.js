export default {
  title: "Categorie",
  name: "measureCategory",
  type: "object",
  fields: [
    {
      title: "Titel van groep",
      description: "Hoe noem je deze groep?",
      name: "title",
      type: "localeString",
    },
    {
      title: "Maatregelen",
      description: "Per groep bestaat er een lijst maatregelen",
      name: "measures",
      type: "array",
      of: [{ type: "measureGroup" }],
    },
  ],
  preview: {
    select: {
      title: "title.nl",
    },
  },
};
