import { defineField, defineType } from 'sanity';
import { RichContentInput } from '../../components/rich-content-input';
import { supportedLanguages } from '../../studio/i18n';
import { richContentFields } from '../fields/rich-content-fields';

export type LocaleBlock = {
  [key: string]: string;
};

export const block = defineType({
  name: 'localeBlock',
  type: 'object',
  title: 'Locale Block Content',
  /**
   * The structure of localeBlock and localeRichContentBlock need to stay equal.
   * When extending the fields, ensure to do that in blockFields and/or sync your changes.
   * @TODO refactor and migrate content into one type.
   */
  fields: supportedLanguages.map(({ title, id }) =>
    defineField({
      title,
      name: id,
      type: 'array',
      of: richContentFields,
      components: {
        input: RichContentInput,
      },
    })
  ),
});
