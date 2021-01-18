export default {
  type: "object",
  title: "Maatregel",
  name: "restriction",
  fields: [
    {
      title: "Maatregel",
      description: "Beschrijf de maatregel voor deze categorie",
      name: "restriction",
      type: "localeString",
    },
  ],
  preview: {
    select: {
      title: "measure.nl",
    },
  },
};
