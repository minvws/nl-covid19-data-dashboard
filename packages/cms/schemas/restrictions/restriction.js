import IconComponent from "../../components/icons/icon";

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
    {
      title: "Icoon",
      description: "Welk icoon moet er naast de maatregel staan?",
      name: "icon",
      type: "string",
      inputComponent: IconComponent,
    },
  ],
  preview: {
    select: {
      title: "measure.nl",
    },
  },
};
