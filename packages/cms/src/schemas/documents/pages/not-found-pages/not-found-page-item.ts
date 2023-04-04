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
        'Select the page type. This determines the level (NL, GM, Articles, General) for which you want this configuration to be used. Attention: This value for each 404 Page should be unique.',
      type: 'string',
      options: {
        list: [
          { value: 'general', title: 'Algemeen' },
          { value: 'nl', title: 'Landelijk' },
          { value: 'gm', title: 'Gemeente' },
          { value: 'article', title: 'Artikelen' },
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
          return count.length > 0 ? 'The page type needs to be unique.' : true;
        }),
      ],
    },
    {
      name: 'title',
      title: 'Titel',
      description: 'Configure the header that will be shown on the page.',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      name: 'description',
      title: 'Beschrijving',
      description: 'Configure a description. This text will be shown below the header.',
      type: 'localeRichContentBlock',
      validation: REQUIRED,
    },
    {
      name: 'links',
      title: 'Links',
      description:
        'Configure a list of links. On the general page, this will be displayed below the description. On all other pages, this will be below the CTA or the search box.',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'notFoundPageLinks' } }],
    },
    {
      name: 'image',
      title: 'Image',
      description: 'Select an image to show on this page. If selected, an alt text must be provided for accessibility.',
      type: 'image',
      fields: [
        {
          name: 'altText',
          title: 'Alt Text',
          description: 'This text will be used by screen readers for accessibility.',
          type: 'localeString',
          validation: REQUIRED,
        },
      ],
      validation: REQUIRED,
    },
    {
      name: 'cta',
      title: 'Call To Action (CTA)',
      description: 'This CTA will be displayed as a button on the page.',
      type: 'object',
      fields: [
        {
          name: 'ctaLabel',
          title: 'CTA Label',
          description: 'If a CTA is configured, then a label must be provided.',
          type: 'localeString',
          validation: REQUIRED,
        },
        {
          name: 'ctaLink',
          title: 'CTA Link',
          description: "If a CTA is configured, then a URL for the CTA's destination must be provided",
          type: 'url',
          validation: REQUIRED,
        },
        {
          name: 'ctaIcon',
          title: 'CTA Icon',
          description: 'If a CTA is configured, you can choose to show an icon to the left of the CTA label',
          type: 'string',
          inputComponent: KpiIconInput,
        },
      ],
    },
  ],
};
