import { MdLanguage } from "react-icons/Md";

export default {
  name: "message",
  title: "Translation Messages",
  icon: MdLanguage,
  type: "document",
  fields: [
    {
      name: "description",
      title: "Description",
      type: "string",
    },
    {
      name: "key",
      title: "System Key",
      type: "string",
    },
    {
      name: "value",
      title: "Value",
      type: "localeString",
    },
  ],
  preview: {
    select: {
      title: "description",
      subtitle: "value.nl",
    },
  },
};
