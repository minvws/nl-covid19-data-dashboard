import { supportedLanguages } from '../../studio/i18n';

export const localeString = {
  name: 'localeString',
  type: 'object',
  title: 'Locale String Content',
  fields: supportedLanguages.map(({ title, id }) => ({
    title,
    name: id,
    type: 'string',
    // inputComponent: ValidatedInput,
  })),
};
