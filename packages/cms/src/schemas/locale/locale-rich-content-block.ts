import { supportedLanguages } from '../../language/supported-languages';
import { blockFields } from '../objects/block-fields';

export const localeRichContentBlock = {
  name: 'localeRichContentBlock',
  type: 'object',
  title: 'Content',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'array',
    of: blockFields,
  })),
};
