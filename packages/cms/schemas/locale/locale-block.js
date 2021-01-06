const supportedLanguages = [
  { id: "nl", title: "Nederlands", isDefault: true },
  { id: "en", title: "Engels" },
];

export default {
  name: "localeBlock",
  type: "object",
  title: "Locale Block Content",
  fieldsets: [
    {
      title: "Vertalingen",
      name: "translations",
      options: { collapsible: true },
    },
  ],
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "array",
    validation: (Rule) => Rule.required(),

    of: [{ type: "block" }],
    fieldset: lang.isDefault ? null : "translations",
  })),
};
