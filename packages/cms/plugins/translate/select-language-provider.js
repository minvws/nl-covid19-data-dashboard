import React, { useEffect, useRef, useState } from 'react';
import config from './config.js';
import { selectedLanguages$, setLangs } from './datastore';
import { onDocument$ } from './document-subject';
import SelectLanguage from './select-language';

function checkFields(document) {
  console.dir(document);
  return true;
}

export default function SelectLanguageProvider() {
  const [selected, setSelected] = useState('nl');
  const [visible, setVisible] = useState(false);
  const [documentInfo, setDocumentInfo] = useState();

  const langSubscription = useRef();
  const docSubscription = useRef();

  useEffect(() => {
    langSubscription.current = selectedLanguages$.subscribe((selected) => {
      setSelected(selected);
    });
    docSubscription.current = onDocument$.subscribe((document) => {
      setVisible(checkFields(document));
      setDocumentInfo(document);
    });
    return () => {
      langSubscription.current.unsubscribe();
      docSubscription.current.unsubscribe();
    };
  }, []);

  return (
    <>
      {visible && document && (
        <SelectLanguage
          languages={config.supportedLanguages}
          selected={selected}
          onChange={setLangs}
          document={documentInfo}
        />
      )}
      {!visible || (!document && <div></div>)}
    </>
  );
}
