import Tabs from "sanity-plugin-tabs";

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
    // {
    //   title: "Maatregelen",
    //   description:
    //     "Schrijf per risiconiveau op wat de geldende maatregelen zijn. Let op, maatregelen in een lockdown vallen niet onder deze routekaart!",
    //   name: "measures",
    //   type: "object",
    //   fields: [
    //     {
    //       title: "Waakzaam",
    //       name: "waakzaam",
    //       type: "array",
    //       of: [{ type: "measure" }],
    //     },
    //     {
    //       title: "Zorgelijk",
    //       name: "zorgelijk",
    //       type: "array",
    //       of: [{ type: "measure" }],
    //     },
    //     {
    //       title: "Ernstig",
    //       name: "ernstig",
    //       type: "array",
    //       of: [{ type: "measure" }],
    //     },
    //     {
    //       title: "Zeer Ernstig",
    //       name: "zeerErnstig",
    //       type: "array",
    //       of: [{ type: "measure" }],
    //     },
    //   ],
    // },

    {
      name: "measures",
      type: "object",
      inputComponent: Tabs,

      fieldsets: [
        { name: "waakzaam", title: "Waakzaam", options: { sortOrder: 10 } },
        { name: "zorgelijk", title: "Zorgelijk", options: { sortOrder: 20 } },
        { name: "ernstig", title: "Ernstig", options: { sortOrder: 30 } },
        {
          name: "zeerErnstig",
          title: "Zeer Ernstig",
          options: { sortOrder: 40 },
        },
      ],
      fields: [
        {
          title: "Maatregelen",
          name: "waakzaam",
          type: "array",
          fieldset: "waakzaam",
          of: [{ type: "measure" }],
        },
        {
          title: "Maatregelen",
          name: "zorgelijk",
          type: "array",
          fieldset: "zorgelijk",
          of: [{ type: "measure" }],
        },
        {
          title: "Maatregelen",
          name: "ernstig",
          type: "array",
          fieldset: "ernstig",
          of: [{ type: "measure" }],
        },
        {
          title: "Maatregelen",
          name: "zeerErnstig",
          type: "array",
          fieldset: "zeerErnstig",
          of: [{ type: "measure" }],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title.nl",
    },
  },
};
