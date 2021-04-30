import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import { onDocument$ } from './helper/document-subject';

type Document = Record<string, any>;

export function useCurrentDocument() {
  const [documentInfo, setDocumentInfo] = useState<Document>();
  const docSubscription = useRef<Subscription>();

  useEffect(() => {
    docSubscription.current = onDocument$.subscribe((document) => {
      setDocumentInfo(document);
    });
    return () => {
      docSubscription.current?.unsubscribe();
    };
  }, []);

  return documentInfo;
}
