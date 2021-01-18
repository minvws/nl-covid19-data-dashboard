export default {
  supportedLanguages: [
    { id: "en", title: "English" },
    { id: "nl", title: "Dutch" },
  ],
  filterField: (enclosingType, field, selectedLanguageIds) =>
    !enclosingType.name.startsWith("locale") ||
    selectedLanguageIds.includes(field.name),
};
