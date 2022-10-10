import { outdent } from 'outdent';
import React, { useState } from 'react';

export function LokalizeTextDescription() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      {isOpen && (
        <>
          <p style={{ fontWeight: 'bold' }}>Lokalize teksten en Markdown</p>
          <p>Lokalize teksten zijn over het algemeen "domme" teksten zonder opmaak. Echter zijn er ook "slimme" teksten die opgemaakt kunnen worden met Markdown.</p>
          <p>
            Als op de cdb-dev-omgeving de "keys"-modus wordt aangezet (om de lokalize-keys te kunnen lezen), wordt bij elk veld wat Markdown ondersteunt een emoji ( ✅ )
            weergegeven. Deze velden zijn dus met markdown op te maken.
          </p>

          <p style={{ marginTop: 30, fontWeight: 'bold' }}>Markdown syntax</p>

          <p>
            <a href="https://commonmark.org/help/" target="_blank" rel="noopener noreferrer">
              → Lees meer over de markdown syntax
            </a>
          </p>

          <p style={{ marginTop: 30, fontWeight: 'bold' }}>Geel meldingsblok in Markdown</p>
          <p>
            Met onze Markdown-implementatie is het mogelijk om een gele melding te tonen, hiervoor hebben we de "blockquote" syntax gekaapt.
            <pre
              style={{
                padding: 10,
                background: '#EEE',
                whiteSpace: 'pre-wrap',
              }}
            >
              {outdent`
                > Dit bericht zal verschijnen in een [geel meldingsblok](#).
              `}
            </pre>
          </p>

          <p style={{ marginTop: 30, fontWeight: 'bold' }}>Context-afhankelijke tekst in Markdown</p>
          <p>
            Met onze Markdown-implementatie is het mogelijk om tekst voor een enkele veiligheidsregio of gemeente weer te geven. Hiervoor hebben we de "codeblock" syntax gekaapt.
            Deze syntax werkt met drie tildes (~~~) of drie back-ticks/accent grave (```).
            <pre
              style={{
                padding: 10,
                background: '#EEE',
                whiteSpace: 'pre-wrap',
              }}
            >
              {outdent`
                ~~~VR09
                Deze tekst zal enkel weergegeven worden als de code VR09 in de url voorkomt.
                ~~~

                ~~~VR10,GM0200
                Deze tekst zal enkel weergegeven worden als de code VR09 of GM0200 in de url voorkomt.

                Overigens kan je binnen zo'n blok weer gewoon markdown opmaak toepassen.
                [zoals links](#).

                Of een melding weergeven met de "blockquote" syntax.
                > Dit zal een gele "warning" banner laten zien
                > > Dit zal een grijze "message" banner laten zien
                ~~~

                Tussen deze blokken kunnen we weer gewone tekst weergeven.

                \`\`\`VR09
                Een "accent grave", ook wel bekend als "backtick", is ook mogelijk.
                \`\`\`
              `}
            </pre>
          </p>
        </>
      )}

      <button onClick={() => setIsOpen((x) => !x)}>{isOpen ? 'Verberg' : 'Toon'} informatie over lokalize en Markdown</button>
    </div>
  );
}
