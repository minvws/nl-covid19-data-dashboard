const supportedLanguages = [
  { id: "nl", title: "Dutch", isDefault: true },
  { id: "en", title: "English" },
];

export default {
  name: "localeBlock",
  type: "object",
  title: "Locale Block Content",
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
    type: "array",
    of: [{ type: "block" }],
    fieldset: lang.isDefault ? null : "translations",
  })),
};
