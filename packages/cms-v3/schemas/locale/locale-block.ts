import { supportedLanguages } from '../../studio/i18n';
import { richTextEditorFields } from '../fields/rich-text-editor-fields';
import { defineType, defineField } from 'sanity';

export const localeBlock = defineType({
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
      of: richTextEditorFields,
      // inputComponent: ValidatedRichText,
    })
  ),
});
