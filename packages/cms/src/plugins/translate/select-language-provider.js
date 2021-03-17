import React, { useEffect, useRef, useState } from 'react';
import { useCurrentDocument } from '../../hooks/use-current-document.js';
import config from './config.js';
import { selectedLanguages$, setLangs } from './datastore';
import SelectLanguage from './select-language';

export default function SelectLanguageProvider() {
  const [selected, setSelected] = useState(['nl']);
  const langSubscription = useRef();
  const document = useCurrentDocument();

  useEffect(() => {
    langSubscription.current = selectedLanguages$.subscribe((selected) => {
      if (selected?.length) {
        setSelected(selected);
      }
    });
    return () => {
      langSubscription.current.unsubscribe();
    };
  }, []);

  return (
    <>
      {document && (
        <SelectLanguage
          languages={config.supportedLanguages}
          selected={selected}
          onChange={setLangs}
          document={document}
        />
      )}
      {!document && <div></div>}
    </>
  );
}
