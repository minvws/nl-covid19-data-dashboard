import React from 'react';

/**
 * A lokalizeText type is referenced by a lokalizeSubject. There can be any number of
 * texts grouped under a subject. Each has a path which corresponds with the
 * JSON path from the root-level key (subject).
 *
 * The text for both EN and NL are stored in a localeText.
 *
 * This is the multi-line version of lokalizeString. Not sure if we need it but
 * seeing if this is useful...
 */

// veiligheidsregio_actueel::data_driven_texts::intake_intensivecare_ma::difference::singular

export const lokalizeText = {
  name: 'lokalizeText',
  type: 'document',
  title: 'Text',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      title: 'Lokalize pad',
      name: 'lokalize_path',
      type: 'string',
      readOnly: true,
      inputComponent: ReadOnlyPath,
    },
    {
      title: 'Onderwerp',
      name: 'subject',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    {
      title: 'Pad',
      name: 'path',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    {
      title: 'Text',
      name: 'text',
      type: 'localeText',
      options: {
        ignoreLanguageSwitcher: true,
      },
      validation: (Rule: any) =>
        /**
         * Only NL is required. For EN we use NL as a fallback when exporting.
         */
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required().warning(),
        }),
    },
    {
      title: 'Toon als lege tekst',
      name: 'display_empty',
      type: 'boolean',
    },
  ],
  preview: {
    select: {
      title: 'path',
      subtitle: 'text.nl',
    },
  },
};

interface Field__incomplete {
  value?: string;
  type: {
    title: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

function ReadOnlyPath({ value, type }: Field__incomplete) {
  return (
    <div>
      <strong>{type.title}</strong>
      <div style={{ fontFamily: 'monospace' }}>
        {value?.split('::').map((x, i, list) => (
          <span style={{ display: 'inline-block' }}>
            {list[i - 1] && '::'}
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}
