import { supportedLanguages } from "./supported-languages";

export default {
  name: "localeText",
  type: "object",
  title: "Locale Text Content",
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "text",
  })),
};
