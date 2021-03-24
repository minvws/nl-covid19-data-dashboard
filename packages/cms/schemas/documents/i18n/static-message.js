import { FaLanguage } from "react-icons/fa";

export default {
  name: "message",
  title: "Translation Messages",
  icon: FaLanguage,
  type: "document",
  fields: [
    {
      name: "key",
      title: "Message Key (extracted from source)",
      type: "string",
    },
    {
      name: "description",
      title: "Description (optional)",
      description: "Describe the key, where is it used and for what purposes?",
      type: "string",
    },
    {
      name: "translations",
      title: "Value",
      type: "object",
      fields: [
        {
          name: "original",
          title: "Dutch: Original value",
          description:
            "This is extracted directly from the sourcecode and not editable.",
          type: "string",
          validation: (Rule) => Rule.required(),
          // readOnly: true,
        },
        {
          name: "nl",
          title: "Dutch: Override default value (optional)",
          description:
            "We will use this value if it's provided. If not filled in, we use the original language value in the front-end.",
          type: "string",
        },
        {
          name: "en",
          title: "English (required)",
          description:
            "This is the english translation of the original value. This is required.",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "description",
      subtitle: "value.nl",
    },
  },
};
