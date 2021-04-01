import { supportedLanguages } from '../../language/supported-languages';

export default {
  supportedLanguages,
  filterField: (enclosingType: any, field: any, selectedLanguageIds: any[]) =>
    !enclosingType.name.startsWith('locale') ||
    selectedLanguageIds.includes(field.name),
};
