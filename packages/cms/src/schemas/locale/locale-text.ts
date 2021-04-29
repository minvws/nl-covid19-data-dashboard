import { supportedLanguages } from '../../language/supported-languages';

export default {
  name: 'localeText',
  type: 'object',
  title: 'Locale Text Content',
  options: {
    /**
     * This option can be set to true when all locale fields should be displayed
     */
    ignoreLanguageSwitcher: false,
  },
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'text',
  })),
};
