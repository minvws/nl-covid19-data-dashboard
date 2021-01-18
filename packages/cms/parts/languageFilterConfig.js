export default {
  supportedLanguages: [
    { id: "en", title: "Engels" },
    { id: "nl", title: "Nederlands" },
  ],
  filterField: (enclosingType, field, selectedLanguageIds) =>
    !enclosingType.name.startsWith("locale") ||
    selectedLanguageIds.includes(field.name),
};
