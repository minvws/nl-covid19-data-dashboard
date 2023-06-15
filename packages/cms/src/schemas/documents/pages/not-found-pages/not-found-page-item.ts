import sanityClient from 'part:@sanity/base/client';
import { Rule } from '~/sanity';
import { KpiIconInput } from '../../../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../../../validation';

const client = sanityClient.withConfig({ apiVersion: '2021-10-21' });

export const notFoundPageItem = {
  name: 'notFoundPageItem',
  title: '404 Pagina',
  type: 'document',
  fields: [
    {
      name: 'pageType',
      title: 'Pagina Type',
      description:
        "Selecteer het type pagina. Dit bepaald het niveau van de pagina ('Landelijk', 'Gemeente', 'Artikelen' of 'Algemeen') waarvoor de pagina gebruikt kan worden. Let op: het type van elke 404 pagina moet uniek zijn.",
      type: 'string',
      options: {
        list: [
          { value: 'general', title: 'Algemeen' },
          { value: 'nl', title: 'Landelijk' },
          { value: 'gm', title: 'Gemeente' },
          { value: 'article', title: 'Artikelen' },
          { value: 'dataExplained', title: 'Cijferverantwoording' },
        ],
        layout: 'dropdown',
      },
      validation: (rule: Rule) => [
        rule.required(),

        // This will populate error messages if there already is an item with this title.
        rule.custom(async (pageType: string, context: any) => {
          const query = `*[_type == 'notFoundPageItem' && pageType == '${pageType}' && !(_id in path('drafts.**')) && !(_id match "*${context.document._id.replace(
            'drafts.',
            ''
          )}")]{...,}`;

          const count = await client.fetch(query);
          return count.length > 0 ? 'Het pagina type moet uniek zijn.' : true;
        }),
      ],
    },
    {
      name: 'title',
      title: 'Titel',
      description: 'Configureer een titel. Wordt bovenaan de pagina getoond.',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      name: 'description',
      title: 'Beschrijving',
      description: 'Configureer een beschrijving. Wordt onder de header getoond.',
      type: 'localeRichContentBlock',
      validation: REQUIRED,
    },
    {
      name: 'links',
      title: 'Links',
      description:
        "Configureer een lijst van een of meer links. Wordt onder de beschrijving getoond op de 'Algemeen' pagina. Wordt onder de CTA of zoekveld getoond op de overige pagina's.",
      type: 'array',
      of: [{ type: 'reference', to: { type: 'notFoundPageLinks' } }],
    },
    {
      name: 'image',
      title: 'Image',
      description: 'Configureer een afbeelding. Voorzie de afbeelding van een alt-tekst voor toegankelijkheidsdoeleinden.',
      type: 'image',
      fields: [
        {
          name: 'altText',
          title: 'Alt Text',
          description: 'De alt-tekst voor de afbeelding. Wordt voorgelezen door screen readers.',
          type: 'localeString',
          validation: REQUIRED,
        },
      ],
      validation: REQUIRED,
    },
    {
      name: 'cta',
      title: 'Call To Action (CTA)',
      description: 'Deze CTA wordt als button getoond.',
      type: 'object',
      fields: [
        {
          name: 'ctaLabel',
          title: 'CTA Label',
          description: 'Het label voor de CTA.',
          type: 'localeString',
          validation: REQUIRED,
        },
        {
          name: 'ctaLink',
          title: 'CTA Link',
          description: 'De bestemming van de CTA. Gebruik altijd relatieve URLs.',
          type: 'string',
          validation: REQUIRED,
        },
        {
          name: 'ctaIcon',
          title: 'CTA Icon',
          description: 'Optioneel icoon voor de CTA. Wordt links van de tekst getoond.',
          type: 'string',
          inputComponent: KpiIconInput,
        },
      ],
    },
  ],
};
