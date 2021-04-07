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
    /**
     * Only NL is required. For EN we use NL as a fallback when exporting. Both
     * can be 1000 chars long (default is 120)
     */
    validation: (Rule: any) =>
      lang.id === 'nl' ? Rule.required().max(1000) : Rule.max(1000),
  })),
};
