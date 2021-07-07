import { supportedLanguages } from '../../language/supported-languages';

export const localeString = {
  name: 'localeString',
  type: 'object',
  title: 'Locale String Content',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'string',
  })),
};

export function localeStringValidation(getRules: (fieldRule: any) => any) {
  return (Rule: any) =>
    Rule.fields({
      nl: (FieldRule: any) => getRules(FieldRule).type('string'),
      en: (FieldRule: any) => getRules(FieldRule).type('string'),
    });
}
