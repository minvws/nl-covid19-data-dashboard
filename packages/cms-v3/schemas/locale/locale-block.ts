import { supportedLanguages } from '../../studio/i18n';
import { blockFields } from '../objects/block-fields';
// TODO: Fix these imports, see corresponding inputComponent in fields below
// import { ValidatedRichText../objects/block-fieldslidated-input/validated-input';
// import { supportedLanguages } from '../../language/supported-languages';

export const localeBlock = {
  name: 'localeBlock',
  type: 'object',
  title: 'Locale Block Content',
  /**
   * The structure of localeBlock and localeRichContentBlock need to stay equal.
   * When extending the fields, ensure to do that in blockFields and/or sync your changes.
   * @TODO refactor and migrate content into one type.
   */
  fields: supportedLanguages.map(({ title, id }) => ({
    title,
    name: id,
    type: 'array',
    of: blockFields,
    // inputComponent: ValidatedRichText,
  })),
};
