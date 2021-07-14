import { Card, Container, Text } from '@sanity/ui';
import React, { useState } from 'react';
import { isDefined } from 'ts-is-present';

/**
 * A text coming from the original Lokalize JSON structure is split into a
 * subject (the first name in the path) and the remaining JSON path. This way it
 * is easy to group and list the documents.
 *
 * The key is added with :: notation for easy access to the search function in
 * both Lokalize and Sanity.
 */
export const lokalizeText = {
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
      title: 'Pad',
      name: 'path',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    {
      title: 'Text',
      name: 'text',
      description: <LokalizeTextDescription />,
      type: 'localeText',
      options: {
        ignoreLanguageSwitcher: true,
      },
      validation: (Rule: any) =>
        /**
         * Only NL is required. For EN we use NL as a fallback when exporting.
         */
        Rule.fields({
          nl: (fieldRule: any) =>
            fieldRule.required().custom(validateTextPlaceholders),
          en: (fieldRule: any) => [
            fieldRule.required().warning(),
            fieldRule.custom(validateTextPlaceholders),
          ],
        }),
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
      title: 'key',
      subtitle: 'text.nl',
    },
  },
};

/**
 * A valid placeholder is considered to look like ``{{placeholderName}}``.
 * This validator looks for mistakes such as ``{placeHolderName}}`` or
 * ``{{placeHolderName}}}``.
 */
function validateTextPlaceholders(text = '') {
  const faultyVariables = [...(text.matchAll(/{+[^}]+}+/g) as any)]
    .map((matchInfo: string[]) => {
      const match = matchInfo[0].match(/{{2}[^{}]+}{2}/);
      if (!match || match[0] !== matchInfo[0]) {
        return matchInfo[0];
      }
      return;
    })
    .filter(isDefined);

  return faultyVariables.length > 0
    ? `De volgende variabelen zijn niet juist geformatteerd: ${faultyVariables
        .map((x) => `"${x}"`)
        .join(', ')}`
    : true;
}

function LokalizeTextDescription() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      {isOpen && (
        <>
          <p style={{ fontWeight: 'bold' }}>Lokalize teksten en Markdown</p>
          <p>
            Lokalize teksten zijn over het algemeen "domme" teksten zonder
            opmaak. Echter zijn er ook "slimme" teksten die opgemaakt kunnen
            worden met Markdown.
          </p>
          <p>
            Als op de cdb-dev-omgeving de "keys"-modus wordt aangezet (om de
            lokalize-keys te kunnen lezen), wordt bij elk veld wat Markdown
            ondersteunt een emoji ( ✅ ) weergegeven. Deze velden zijn dus met
            markdown op te maken.
          </p>

          <p style={{ marginTop: 30, fontWeight: 'bold' }}>Markdown syntax</p>

          <p>
            <a
              href="https://commonmark.org/help/"
              target="_blank"
              rel="noopener noreferrer"
            >
              → Lees meer over de markdown syntax
            </a>
          </p>

          <p style={{ marginTop: 30, fontWeight: 'bold' }}>
            Geel meldingsblok in Markdown
          </p>
          <p>
            Met onze Markdown-implementatie is het mogelijk om een gele melding
            te tonen, hiervoor hebben we de "blockquote" syntax gekaapt.
            <pre
              style={{
                padding: 10,
                background: '#EEE',
                whiteSpace: 'pre-wrap',
              }}
            >
              {`
> Dit bericht zal verschijnen in een [geel meldingsblok](#).
`.trim()}
            </pre>
          </p>

          <p style={{ marginTop: 30, fontWeight: 'bold' }}>
            Context-afhankelijke tekst in Markdown
          </p>
          <p>
            Met onze Markdown-implementatie is het mogelijk om tekst voor een
            enkele veiligheidsregio of gemeente weer te geven. Hiervoor hebben
            we de "codeblock" syntax gekaapt. Deze syntax werkt met drie tildes
            (~~~) of drie backticks/accent grave (```).
            <pre
              style={{
                padding: 10,
                background: '#EEE',
                whiteSpace: 'pre-wrap',
              }}
            >
              {`
~~~VR09
Deze tekst zal enkel weergegeven worden als de code VR09 in de url voorkomt.
~~~

~~~VR10,GM0200
Deze tekst zal enkel weergegeven worden als de code VR09 of GM0200 in de url voorkomt.

Overigens kan je binnen zo'n blok weer gewoon markdown opmaak toepassen.
[zoals links](#).

> Of een melding weergeven met de "blockquote" syntax.
~~~

Tussen deze blokken kunnen we weer gewone tekst weergeven.

\`\`\`VR09
Een "accent grave", ook wel bekend als "backtick", is ook mogelijk.
\`\`\`
`.trim()}
            </pre>
          </p>
        </>
      )}

      <button onClick={() => setIsOpen((x) => !x)}>
        {isOpen ? 'Verberg' : 'Toon'} informatie over lokalize en Markdown
      </button>
    </div>
  );
}
