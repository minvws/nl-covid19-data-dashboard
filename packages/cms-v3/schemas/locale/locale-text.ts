import { defineField, defineType } from 'sanity';
import { TextAreaInput } from '../../components/string-input';
import { supportedLanguages } from '../../studio/i18n';

export const localeText = defineType({
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
