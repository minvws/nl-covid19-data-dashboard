import defaultResolve from 'part:@sanity/base/document-actions';
import { onDocument$ } from './plugins/translate/document-subject';

export default function resolveDocumentActions(props) {
  const current = onDocument$.getValue();
  if (current !== props) {
    onDocument$.next(props);
  }
  return defaultResolve(props);
}
