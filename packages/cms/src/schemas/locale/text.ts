import { defineField, defineType } from 'sanity';
import { TextAreaInput } from '../../components/string-input';
import { supportedLanguages } from '../../studio/i18n';

export type LocaleText = {
  [key: string]: string;
};

export const text = defineType({
  name: 'localeText',
  type: 'object',
  title: 'Locale Text Content',
  fields: supportedLanguages.map(({ title, id }) =>
    defineField({
      title,
      name: id,
      type: 'text',
      components: {
        input: TextAreaInput,
      },
    })
  ),
});
