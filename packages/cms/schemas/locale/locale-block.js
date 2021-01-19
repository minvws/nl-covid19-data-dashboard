import { supportedLanguages } from "./supported-languages";

export default {
  name: "localeBlock",
  type: "object",
  title: "Locale Block Content",
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "array",
    of: [
      {
        type: "block",
      },
    ],
  })),
};
