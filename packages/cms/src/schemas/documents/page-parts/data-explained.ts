import { Bs123 } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';
import { localeStringValidation, localeValidation } from '../../../studio/validation/locale-validation';
import { PAGE_IDENTIFIER_REFERENCE_FIELDS, PAGE_IDENTIFIER_REFERENCE_FIELDSET } from '../../fields/page-fields';

export const dataExplained = defineType({
  title: 'Pagina cijferverantwoording',
  name: 'pageDataExplained',
  type: 'document',
  icon: Bs123,
  fieldsets: [
    PAGE_IDENTIFIER_REFERENCE_FIELDSET,
    {
      title: 'FAQ Configuratie',
      name: 'faqConfiguration',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    ...PAGE_IDENTIFIER_REFERENCE_FIELDS,
    defineField({
      title: 'Button kop',
      name: 'buttonTitle',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Button tekst',
      name: 'buttonText',
      type: 'localeBlock',
      validation: localeValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Cijferverantwoordingpagina-link',
      name: 'item',
      type: 'reference',
      to: [{ type: 'cijferVerantwoordingItem' }],
      validation: (rule) => rule.required(),
    }),
  ],
});
