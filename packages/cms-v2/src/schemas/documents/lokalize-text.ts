import React from 'react';
import { isDefined } from 'ts-is-present';
import { Rule } from '~/sanity';
import { LokalizeTextDescription } from '../../lokalize/lokalize-text-description';

/**
 * A text coming from the original Lokalize JSON structure is split into a
 * subject (the first name in the path) and the remaining JSON path. This way it
 * is easy to group and list the documents.
 *
 * The key is added with :: notation for easy access to the search function in
 * both Lokalize and Sanity.
 */
export const lokalizeText = {
  // See: https://www.sanity.io/docs/ui-affordances-for-actions
  // We don't allow creation of new keys or deleting them from the UI.
  __experimental_actions: ['update', 'publish'],
  name: 'lokalizeText',
  type: 'document',
  title: 'Text',
  fields: [
    {
      title: 'Key',
      name: 'key',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    {
      title: 'Onderwerp',
      name: 'subject',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    {
      title: 'Text',
      name: 'text',
      description: React.createElement(LokalizeTextDescription),
      type: 'localeText',
      options: {
        ignoreLanguageSwitcher: true,
      },
      validation: (rule: Rule) => [
        rule.fields({
          nl: (rule: Rule) => rule.required(),
          en: (rule: Rule) => rule.required().warning(),
        }),
        rule.custom(validateLocaleTextPlaceholders),
      ],
    },
    {
      title: 'Toon als lege tekst',
      name: 'should_display_empty',
      type: 'boolean',
    },
    {
      name: 'is_newly_added',
      type: 'boolean',
      readOnly: true,
      hidden: true,
    },
    {
      name: 'is_move_placeholder',
      type: 'boolean',
      readOnly: true,
      hidden: true,
    },
    {
      name: 'publish_count',
      type: 'number',
      readOnly: true,
      hidden: true,
    },
  ],
  preview: {
    select: {
      /**
       * The key field works probably a little better for the searching results
       * list, but the path field is cleaner when browsing texts because it
       * avoids a lot of string duplication.
       */
      key: 'key',
      subtitle: 'text.nl',
    },
    prepare({ key, subtitle }: { key: string; subtitle: string }) {
      const title = key.split('.').slice(3).join('.');
      return {
        title,
        subtitle,
      };
    },
  },
};

function validateLocaleTextPlaceholders({ en, nl }: { en?: string; nl?: string }) {
  const enErrors = getFaultyParameterPlaceholders(en);
  const nlErrors = getFaultyParameterPlaceholders(nl);

  if (enErrors.length) {
    const vars = enErrors.map((x) => `"${x}"`).join(', ');
    return {
      message: `De volgende variabelen zijn niet juist geformatteerd: ${vars}`,
      paths: ['en'],
    };
  }

  if (nlErrors.length) {
    const vars = nlErrors.map((x) => `"${x}"`).join(', ');
    return {
      message: `De volgende variabelen zijn niet juist geformatteerd: ${vars}`,
      paths: ['nl'],
    };
  }

  return true;
}

/**
 * A valid placeholder is considered to look like ``{{placeholderName}}``.
 * This validator looks for mistakes such as ``{placeHolderName}}`` or
 * ``{{placeHolderName}}}``.
 */
function getFaultyParameterPlaceholders(text = '') {
  const faultyVariables = [...(text.matchAll(/{+[^}]+}+/g) as any)]
    .map((matchInfo: string[]) => {
      const match = matchInfo[0].match(/{{2}[^{}]+}{2}/);
      if (!match || match[0] !== matchInfo[0]) {
        return matchInfo[0];
      }
      return;
    })
    .filter(isDefined);

  return faultyVariables;
}
