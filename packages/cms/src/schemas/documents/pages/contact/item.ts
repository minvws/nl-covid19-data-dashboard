import { ValidationContext, defineArrayMember, defineField, defineType } from 'sanity';
import { localeValidation } from '../../../../studio/validation/locale-validation';

export const contactPageGroupItem = defineType({
  name: 'contactPageGroupItem',
  title: 'Contactpagina Item',
  description: 'Configureer een item voor een bepaalde contactpaginagroep.',
  type: 'document',
  fieldsets: [
    {
      title: 'Item Titel Configuratie',
      name: 'titleConfiguration',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
    {
      title: 'Item Beschrijving',
      name: 'itemDescription',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      description:
        'Configureer de titel en de link voor dit item. Als u een link aan een e-mail wilt toevoegen, vult u alleen het e-mailadres in. Als je een link naar een telefoonnummer wilt toevoegen, voeg dan alleen het nummer toe.',
      type: 'localeString',
      fieldset: 'titleConfiguration',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'itemTitleUrl',
      title: 'Link',
      description:
        'De bestemming voor de link naar de itemtitel. U kunt dit veld leeg laten als de titel geen link vereist. Als u een link aan een e-mail wilt toevoegen, vult u alleen het e-mailadres in. Als je een link naar een telefoonnummer wilt toevoegen, voeg dan alleen het nummer toe.',
      type: 'string',
      fieldset: 'titleConfiguration',
    }),
    defineField({
      name: 'linkType',
      type: 'linkType',
      fieldset: 'titleConfiguration',
      validation: (rule) =>
        rule.custom((value, context: ValidationContext) => {
          const parent = context.parent as { itemTitleUrl: string };
          return 'itemTitleUrl' in parent && parent.itemTitleUrl.length && value === undefined ? 'Dit veld is verplicht als uw titel een link bevat' : true;
        }),
      hidden: ({ parent }) => !('itemTitleUrl' in parent && parent.itemTitleUrl.length),
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving',
      description: 'Configureer een beschrijving. Wordt onder de titel getoond.',
      type: 'localeBlock',
      fieldset: 'itemDescription',
      validation: localeValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'contactPageItemLinks',
      title: 'Item Links',
      description: 'Configureer een lijst met links voor dit item. Als er geen links nodig zijn, kan deze leeg gelaten worden. Deze worden onder de beschrijving weergegeven.',
      type: 'array',
      of: [defineArrayMember({ type: 'contactPageItemLink' })],
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
});
