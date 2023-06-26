import { BsQuestionCircle } from 'react-icons/bs';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { PAGE_IDENTIFIER_REFERENCE_FIELDS, PAGE_IDENTIFIER_REFERENCE_FIELDSET } from '../../fields/page-fields';

export const faq = defineType({
  title: "Pagina FAQ's",
  name: 'pageFAQs',
  type: 'document',
  icon: BsQuestionCircle,
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
      title: 'Vragen',
      name: 'faqQuestions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: { type: 'faqQuestion' },
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
  ],
});
