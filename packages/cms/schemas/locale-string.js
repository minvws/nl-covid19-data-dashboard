const supportedLanguages = [
  { id: "nl", title: "Dutch", isDefault: true },
  { id: "en", title: "English" },
];

export default {
  name: "localeString",
  type: "object",
  title: "Locale String Content",
  fieldsets: [
    {
      title: "Translations",
      name: "translations",
      options: { collapsible: true },
    },
  ],
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "string",
    fieldset: lang.isDefault ? null : "translations",
  })),
};
