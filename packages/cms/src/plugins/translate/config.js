import { supportedLanguages } from '../../language/supported-languages';

export default {
  supportedLanguages,
  filterField: (enclosingType, field, selectedLanguageIds) =>
    !enclosingType.name.startsWith('locale') ||
    selectedLanguageIds.includes(field.name),
};
