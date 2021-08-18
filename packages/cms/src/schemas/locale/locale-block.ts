import { supportedLanguages } from '../../language/supported-languages';
import { blockFields } from '../objects/block-fields';

export const localeBlock = {
  name: 'localeBlock',
  type: 'object',
  title: 'Locale Block Content',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'array',
    of: blockFields,
  })),
};
