import { ValidationContext, defineArrayMember, defineField, defineType } from 'sanity';
import { IconInput } from '../../../../components/icon-input';
import { client } from '../../../../studio/client';
import { localeStringValidation, localeValidation } from '../../../../studio/validation/locale-validation';

const pageTypeOptions = [
  { value: 'general', title: 'Algemeen' },
  { value: 'nl', title: 'Landelijk' },
  { value: 'gm', title: 'Gemeente' },
  { value: 'article', title: 'Artikelen' },
  { value: 'dataExplained', title: 'Cijferverantwoording' },
];

export const notFoundItem = defineType({
  name: 'notFoundPageItem',
  title: '404 Pagina',
  type: 'document',
  fields: [
    defineField({
      name: 'pageType',
      title: 'Pagina Type',
      description:
        "Selecteer het type pagina. Dit bepaald het niveau van de pagina ('Landelijk', 'Gemeente', 'Artikelen' of 'Algemeen') waarvoor de pagina gebruikt kan worden. Let op: het type van elke 404 pagina moet uniek zijn.",
      type: 'string',
      options: {
        list: pageTypeOptions,
        layout: 'dropdown',
      },
      validation: (rule) => [
        rule.required(),

        // This will populate error messages if there already is an item with this title.
        rule.custom(async (pageType: string | undefined, context: ValidationContext) => {
          if (!pageType) return true;

          const query = `//groq
            *[_type == 'notFoundPageItem' && pageType == '${pageType}' && !(_id in path('drafts.**')) && !(_id match "*${context.document?._id.replace('drafts.', '')}")]{...,}
          `;

          const count = await client.fetch(query);
          return count.length > 0 ? 'Het pagina type moet uniek zijn.' : true;
        }),
      ],
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      description: 'Configureer een titel. Wordt bovenaan de pagina getoond.',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving',
      description: 'Configureer een beschrijving. Wordt onder de header getoond.',
      type: 'localeRichContentBlock',
      validation: localeValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      description:
        "Configureer een lijst van een of meer links. Wordt onder de beschrijving getoond op de 'Algemeen' pagina. Wordt onder de CTA of zoekveld getoond op de overige pagina's.",
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'notFoundPageLinks' } })],
    }),
    defineField({
      name: 'image',
      title: 'Afbeelding',
      description: 'Configureer een afbeelding. Voorzie de afbeelding van een alt-tekst voor toegankelijkheidsdoeleinden.',
      type: 'image',
      fields: [
        {
          name: 'altText',
          title: 'Alt Text',
          description: 'De alt-tekst voor de afbeelding. Wordt voorgelezen door screen readers.',
          type: 'localeString',
          validation: localeStringValidation((rule) => rule.required()),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Call To Action (CTA)',
      description: 'Deze CTA wordt als button getoond.',
      type: 'object',
      fields: [
        defineField({
          name: 'ctaLabel',
          title: 'Label',
          description: 'Het label voor de CTA.',
          type: 'localeString',
          validation: localeStringValidation((rule) => rule.required()),
        }),
        defineField({
          name: 'ctaLink',
          title: 'Link',
          description: 'De bestemming van de CTA. Gebruik altijd relatieve URLs.',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'ctaIcon',
          title: 'Icon',
          description: 'Optioneel icoon voor de CTA. Wordt links van de tekst getoond.',
          type: 'string',
          components: {
            input: IconInput,
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'pageType',
      media: 'image',
    },
    prepare: ({ title, media }) => {
      const formattedTitle = pageTypeOptions.find((pageTypeOptions) => pageTypeOptions.value === title)?.title ?? title;
      return {
        title: formattedTitle,
        media: media.asset,
      };
    },
  },
});
