import {
  SupportedLanguageId,
  supportedLanguages,
} from '../../language/supported-languages';

export default {
  supportedLanguages,
  filterField: (
    enclosingType: any,
    field: any,
    selectedLanguageIds: SupportedLanguageId[]
  ) =>
    !enclosingType.name.startsWith('locale') ||
    selectedLanguageIds.includes(field.name),
};
