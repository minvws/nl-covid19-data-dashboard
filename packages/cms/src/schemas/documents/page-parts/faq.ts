import { BsQuestionCircle } from 'react-icons/bs';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { localeStringValidation, localeValidation } from '../../../studio/validation/locale-validation';
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
      title: 'Button titel',
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
      title: 'Sectie titel',
      name: 'sectionTitle',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
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
