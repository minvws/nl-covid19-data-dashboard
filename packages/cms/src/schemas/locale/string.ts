import { StringInput } from '../../components/string-input';
import { supportedLanguages } from '../../studio/i18n';
import { defineType, defineField } from 'sanity';

export type LocaleString = {
  [key: string]: string;
};

export const string = defineType({
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
      },
    })
  ),
});
