import React from "react";
import IconComponent from "../../components/icons/icon";
import { restrictionIcons } from "../../components/icons/icons";

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
      title: "restriction.nl",
      icon: "icon",
    },
    prepare(selection) {
      const { title, icon } = selection;

      return {
        title: title,

        // `media` takes a function, string or React element
        // Remember to import React from 'react' if you are rendering React components like below
        media: (
          <img
            src={restrictionIcons[icon]}
            alt="Selection icon for restriction"
          />
        ),
      };
    },
  },
};
