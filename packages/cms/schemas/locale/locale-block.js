const supportedLanguages = [
  { id: "nl", title: "Nederlands", isDefault: true },
  { id: "en", title: "Engels" },
];

export default {
  name: "localeBlock",
  type: "object",
  title: "Locale Block Content",
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "array",
    of: [{
      type: "block"
    }],
  })),
};
