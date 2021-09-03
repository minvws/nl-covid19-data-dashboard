import { supportedLanguages } from '../../language/supported-languages';
import { blockFields } from '../objects/block-fields';

export const localeBlock = {
  name: 'localeBlock',
  type: 'object',
  title: 'Locale Block Content',
  /**
   * The structure of localeBlock and localeRichContentBlock need to stay equal.
   * When extending the fields, ensure to do that in blockFields and/or sync your changes.
   */
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'array',
    of: blockFields,
  })),
};
