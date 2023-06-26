import { Bs123 } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';
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
      title: 'Cijferverantwoordingpagina-link',
      name: 'dataExplainedItem',
      type: 'reference',
      to: [{ type: 'cijferVerantwoordingItem' }],
    }),
  ],
});
