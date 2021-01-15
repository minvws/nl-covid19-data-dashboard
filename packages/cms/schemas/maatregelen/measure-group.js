export default {
  title: "Maatregel groep",
  name: "measureGroup",
  type: "object",
  fields: [
    {
      title: "Maatregel groep",
      description: "Waar gaat deze maatregel groep over?",
      name: "title",
      type: "localeString",
    },
    {
      title: "Maatregelen",
      description:
        "Schrijf per risiconiveau op wat de geldende maatregelen zijn. Let op, maatregelen in een lockdown vallen niet onder deze routekaart!",
      name: "measures",
      type: "object",
      fields: [
        {
          title: "Waakzaam",
          name: "waakzaam",
          type: "array",
          of: [{ type: "measure" }],
        },
        {
          title: "Zorgelijk",
          name: "zorgelijk",
          type: "array",
          of: [{ type: "measure" }],
        },
        {
          title: "Ernstig",
          name: "ernstig",
          type: "array",
          of: [{ type: "measure" }],
        },
        {
          title: "Zeer Ernstig",
          name: "zeerErnstig",
          type: "array",
          of: [{ type: "measure" }],
        },
      ],
    },
  ],
};
