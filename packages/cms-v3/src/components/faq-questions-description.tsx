import { Box, Button, Text, TextProps } from '@sanity/ui';
import { useState } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import styled from 'styled-components';

export const FaqQuestionsDescription = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box style={{ marginBlock: 8 }}>
      <P>Je kan veelgestelde vragen toevoegen, de volgorde veranderen, de tekst bijwerken of verwijderen.</P>

      {isOpen && (
        <>
          <P weight="bold">Sortering van de kolomen</P>

          <P>
            De veelgestelde vragen worden in productie in twee kolommen weergegeven. Welke groep vragen gekoppeld is aan de kolom wordt bepaald door de groepen in tweeën te delen.
            De sortering van het onderstaande overzicht wordt aangehouden en er wordt gekeken naar welke groep als eerste een vraag heeft in deze lijst. Die groep is <i>groep 1</i>
            . Vervolgens wordt gekeken naar de volgende vraag van een nieuwe groep. En dat wordt <i>groep 2</i>. Totdat elke groep een plaats in de sortering heeft. Vervolgens
            wordt de eerste helft van deze volgorde links weergegeven op de "Veelgestelde vragen"-pagina. En de tweede helft van deze volgorde rechts.
          </P>

          <P>
            Om een groep van van de linker naar de rechter kolom te wisselen moeten de vragen van deze groep lager staan dan de helft van het aantal groepen. Om een groep van van
            de rechter naar de linker kolom te wisselen moet de eerste vraag van deze groep hoger staan dan de helft van het aantal groepen.
          </P>
        </>
      )}

      <Button
        fontSize={1}
        icon={BsInfoCircle}
        padding={3}
        tone="primary"
        text={`${isOpen ? 'Verberg' : 'Toon'} informatie over de sortering van de kolomen`}
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
