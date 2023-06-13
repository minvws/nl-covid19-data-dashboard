import { colors } from '@corona-dashboard/common';
import { Box, Button, Heading, Text, TextProps } from '@sanity/ui';
import { outdent } from 'outdent';
import { useState } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import styled from 'styled-components';

export const LokalizeDocumentDescription = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box style={{ marginBlock: 8 }}>
      {isOpen && (
        <>
          <Heading as="h1" size={1}>
            Lokalize teksten en Markdown
          </Heading>

          <P>Lokalize teksten zijn over het algemeen "domme" teksten zonder opmaak. Echter zijn er ook "slimme" teksten die opgemaakt kunnen worden met Markdown.</P>

          <P>
            Als op de cdb-dev-omgeving de "keys"-modus wordt aangezet (om de lokalize-keys te kunnen lezen), wordt bij elk veld wat Markdown ondersteunt een emoji ( ✅ )
            weergegeven. Deze velden zijn dus met markdown op te maken.
          </P>

          <Heading as="h2" size={0}>
            Markdown syntax
          </Heading>

          <P>
            <a href="https://commonmark.org/help/" target="_blank" rel="noopener noreferrer">
              → Lees meer over de markdown syntax
            </a>
          </P>

          <Heading as="h2" size={0}>
            Geel meldingsblok in Markdown
          </Heading>

          <P>
            Met onze Markdown-implementatie is het mogelijk om een gele melding te tonen, hiervoor hebben we de "blockquote" syntax gekaapt.
            <Pre>{'>'} Dit bericht zal verschijnen in een [geel meldingsblok](#).</Pre>
          </P>

          <Heading as="h2" size={0}>
            Context-afhankelijke tekst in Markdown
          </Heading>

          <P>
            Met onze Markdown-implementatie is het mogelijk om tekst voor een enkele veiligheidsregio of gemeente weer te geven. Hiervoor hebben we de "codeblock" syntax gekaapt.
            Deze syntax werkt met drie tildes (~~~) of drie back-ticks/accent grave (```).
            <Pre>
              {outdent`
                  ~~~VR09
                  Deze tekst zal enkel weergegeven worden als de code VR09 in de url voorkomt.
                  ~~~

                  ~~~VR10,GM0200
                  Deze tekst zal enkel weergegeven worden als de code VR09 of GM0200 in de url voorkomt.

                  Overigens kan je binnen zo'n blok weer gewoon markdown opmaak toepassen.
                  [zoals links](#).

                  Of een melding weergeven met de "blockquote" syntax.
                  {'>'} Dit zal een gele "warning" banner laten zien
                  {'> >'} Dit zal een grijze "message" banner laten zien
                  ~~~

                  Tussen deze blokken kunnen we weer gewone tekst weergeven.

                  \`\`\`VR09
                  Een "accent grave", ook wel bekend als "backtick", is ook mogelijk.
                  \`\`\`
                `}
            </Pre>
          </P>
        </>
      )}

      <Button
        fontSize={1}
        icon={BsInfoCircle}
        padding={3}
        tone="primary"
        text={`${isOpen ? 'Verberg' : 'Toon'} informatie over lokalize en Markdown`}
        onClick={() => setIsOpen((previousValue) => !previousValue)}
        style={{ cursor: 'pointer' }}
      />
    </Box>
  );
};

const P = styled(Text)<TextProps>`
  font-size: 0.8125rem;
  margin-block: 1.5em;
`;

const Pre = styled.pre`
  background-color: ${colors.yellow3}26; // results in colors.yellow3 with 85% transparency
  padding: 10px;
  white-space: pre-wrap;
`;
