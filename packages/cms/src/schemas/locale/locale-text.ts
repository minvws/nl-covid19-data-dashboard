import { supportedLanguages } from '../../language/supported-languages';

export default {
  name: 'localeText',
  type: 'object',
  title: 'Locale Text Content',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'text',
    rows: 4,
    max: 1000,
    // validation: (Rule: any) =>
    //   Rule.max(1000).warning(`A title shouldn't be more than 1k characters.`),
  })),
};
