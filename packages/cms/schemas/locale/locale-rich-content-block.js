const supportedLanguages = [
  { id: "nl", title: "Nederlands", isDefault: true },
  { id: "en", title: "Engels" },
];

export default {
  name: "localeRichContentBlock",
  type: "object",
  title: "Locale Rich Content Block",
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "array",
    of: [
      {
        type: "block"
      },
      {
        type: "image"
      },
      {
        type: "lineChart"
      }
    ]
  })),
};
