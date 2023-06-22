import { ValidatedInput } from '../../components/validated-input';
import { supportedLanguages } from '../../language/supported-languages';

export const localeString = {
  name: 'localeString',
  type: 'object',
  title: 'Locale String Content',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'string',
    inputComponent: ValidatedInput,
  })),
};
