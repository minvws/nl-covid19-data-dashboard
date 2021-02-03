import { useEffect, useRef, useState } from 'react';
import { onDocument$ } from './helper/document-subject';

export function useCurrentDocument() {
  const [documentInfo, setDocumentInfo] = useState();
  const docSubscription = useRef();

  useEffect(() => {
    docSubscription.current = onDocument$.subscribe((document) => {
      setDocumentInfo(document);
    });
    return () => {
      docSubscription.current.unsubscribe();
    };
  }, []);

  return documentInfo;
}
