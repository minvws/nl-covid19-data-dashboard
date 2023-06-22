import { SupportedLanguageId, supportedLanguages } from '../../language/supported-languages';

export { supportedLanguages };

export function filterField(enclosingType: any, field: any, selectedLanguageIds: SupportedLanguageId[]) {
  return enclosingType.options.ignoreLanguageSwitcher || !enclosingType.name.startsWith('locale') || selectedLanguageIds.includes(field.name);
}
