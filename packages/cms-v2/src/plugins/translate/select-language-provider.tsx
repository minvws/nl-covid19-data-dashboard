import React, { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import { useCurrentDocument } from '../../hooks/use-current-document';
import { supportedLanguages } from './config';
import { selectedLanguages$, setLangs } from './datastore';
import SelectLanguage from './select-language';

export default function SelectLanguageProvider() {
  const [selected, setSelected] = useState(['nl']);
  const langSubscription = useRef<Subscription | undefined>();
  const currentDocument = useCurrentDocument();

  useEffect(() => {
    langSubscription.current = selectedLanguages$.subscribe((selected) => {
      if (selected?.length) {
        setSelected(selected);
      }
    });
    return () => {
      langSubscription.current?.unsubscribe();
    };
  }, []);

  return (
    <>
      {currentDocument && <SelectLanguage languages={supportedLanguages} selected={selected} onChange={setLangs} document={currentDocument} />}
      {!currentDocument && <div></div>}
    </>
  );
}
