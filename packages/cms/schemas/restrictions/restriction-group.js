import React from "react";
import Tabs from "sanity-plugin-tabs";
import IconComponent from "../../components/icons/icon";
import { restrictionIcons } from "../../components/icons/icons";

export default {
  title: "Maatregel groep",
  name: "restrictionGroup",
  type: "object",
  fields: [
    {
      title: "Maatregel groep",
      description: "Waar gaat deze maatregel groep over?",
      name: "title",
      type: "localeString",
    },
    {
      title: "Icoon",
      description: "Welk icoon moet er naast de maatregelen groep staan?",
      name: "icon",
      type: "string",
      inputComponent: IconComponent,
    },
    {
      name: "restrictions",
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
          of: [{ type: "restriction" }],
        },
        {
          title: "Maatregelen",
          name: "zorgelijk",
          type: "array",
          fieldset: "zorgelijk",
          of: [{ type: "restriction" }],
        },
        {
          title: "Maatregelen",
          name: "ernstig",
          type: "array",
          fieldset: "ernstig",
          of: [{ type: "restriction" }],
        },
        {
          title: "Maatregelen",
          name: "zeerErnstig",
          type: "array",
          fieldset: "zeerErnstig",
          of: [{ type: "restriction" }],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title.nl",
      icon: "icon",
    },
  },
  prepare(selection) {
    const { title, icon } = selection;

    console.log({ title, icon });

    return {
      title: title,
      media: (
        <img
          src={restrictionIcons[icon]}
          alt="Selection icon for restriction"
        />
      ),
    };
  },
};
