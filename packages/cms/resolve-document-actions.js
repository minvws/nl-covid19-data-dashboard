import defaultResolve from 'part:@sanity/base/document-actions';
import { onDocument$ } from './hooks/helper/document-subject';

export default function resolveDocumentActions(props) {
  const current = onDocument$.getValue();
  if (current?.id !== props.id) {
    onDocument$.next(props);
  }
  return defaultResolve(props);
}
