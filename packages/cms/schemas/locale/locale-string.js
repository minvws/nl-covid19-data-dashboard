const supportedLanguages = [
  { id: "nl", title: "Nederlands", isDefault: true },
  { id: "en", title: "Engels" },
];

export default {
  name: "localeString",
  type: "object",
  title: "Locale String Content",
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
    type: "string",
    validation: (Rule) => Rule.required(),
    fieldset: lang.isDefault ? null : "translations",
  })),
};
