import { defineField, defineType } from 'sanity';
import { supportedLanguages } from '../../studio/i18n';
import { richContentFields } from '../fields/rich-content-fields';

export type LocaleRichContentBlock = {
  [key: string]: string;
};

export const richContentBlock = defineType({
  name: 'localeRichContentBlock',
  type: 'object',
  title: 'Locale Block Content',
  /**
   * The structure of localeBlock and localeRichContentBlock need to stay equal.
   * When extending the fields, ensure to do that in blockFields and/or sync your changes.
   */
  fields: supportedLanguages.map(({ title, id }) =>
    defineField({
      title,
      name: id,
      type: 'array',
      of: richContentFields,
    })
  ),
});
