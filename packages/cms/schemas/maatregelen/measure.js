export default {
  type: "object",
  title: "Maatregel",
  name: "measure",
  fields: [
    {
      title: "Maatregel",
      description: "Beschrijf de maatregel voor deze categorie",
      name: "measure",
      type: "localeString",
    },
  ],
  preview: {
    select: {
      title: "measure.nl",
    },
  },
};
