import { StringInput } from '../../components/string-input';
import { StringField } from '../../components/string-field';
import { supportedLanguages } from '../../studio/i18n';
import { defineType, defineField } from 'sanity';

export const localeString = defineType({
  name: 'localeString',
  type: 'object',
  title: 'Locale String Content',
  fields: supportedLanguages.map(({ title, id }) =>
    defineField({
      title,
      name: id,
      type: 'string',
      components: {
        input: StringInput,
        field: StringField,
      },
    })
  ),
});
