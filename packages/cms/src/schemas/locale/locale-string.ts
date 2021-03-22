import { supportedLanguages } from '../../language/supported-languages';

export default {
  name: 'localeString',
  type: 'object',
  title: 'Locale String Content',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'string',
  })),
};
