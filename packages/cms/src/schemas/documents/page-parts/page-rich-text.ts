import { localeValidation } from '../../../language/locale-validation';
import { PAGE_IDENTIFIER_REFERENCE_FIELDS, PAGE_IDENTIFIER_REFERENCE_FIELDSET } from '../../fields/page-identifier-reference-fields';

export const pageRichText = {
  title: 'Pagina tekst blok',
  name: 'pageRichText',
  type: 'document',
  fieldsets: [PAGE_IDENTIFIER_REFERENCE_FIELDSET],
  fields: [
    ...PAGE_IDENTIFIER_REFERENCE_FIELDS,
    {
      title: 'Text',
      name: 'text',
      type: 'localeBlock',
      validation: localeValidation((rule) => rule.required()),
    },
  ],
};
