import React, { useState } from 'react';

export function FrequentlyAskedQuestionsList() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      Je kan veelgestelde vragen toevoegen, de volgorde veranderen, de tekst bijwerken of verwijderen
      {isOpen && (
        <>
          <p style={{ fontWeight: 'bold' }}>Sortering van de kolomen</p>
          <p>
            De veelgestelde vragen worden in productie in twee kolommen weergegeven. Welke groep vragen gekoppeld is aan de kolom wordt bepaald door de groepen in tweeën te delen.
            De sortering van het onderstaande overzicht wordt aangehouden en er wordt gekeken naar welke groep als eerste een vraag heeft in deze lijst. Die groep is <i>groep 1</i>
            . Vervolgens wordt gekeken naar de volgende vraag van een nieuwe groep. En dat wordt <i>groep 2</i>. Totdat elke groep een plaats in de sortering heeft. Vervolgens
            wordt de eerste helft van deze volgorde links weergegeven op de "Veelgestelde vragen"-pagina. En de tweede helft van deze volgorde rechts.
          </p>
          <p>
            Om een groep van van de linker naar de rechter kolom te wisselen moeten de vragen van deze groep lager staan dan de helft van het aantal groepen. Om een groep van van
            de rechter naar de linker kolom te wisselen moet de eerste vraag van deze groep hoger staan dan de helft van het aantal groepen.
          </p>
        </>
      )}
      <button style={{ marginTop: '.5rem' }} onClick={() => setIsOpen((x) => !x)}>
        {isOpen ? 'Verberg' : 'Toon'} informatie over de sortering van de kolomen
      </button>
    </div>
  );
}
