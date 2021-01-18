import { supportedLanguages } from "./supported-languages";

export default {
  name: "localeString",
  type: "object",
  title: "Locale String Content",
  // fieldsets: [
  //   {
  //     title: "Vertalingen",
  //     name: "translations",
  //     options: { collapsible: true },
  //   },
  // ],
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "string",
    // fieldset: lang.isDefault ? null : "translations",
  })),
};
