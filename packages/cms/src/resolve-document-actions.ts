import defaultResolve, {
  DeleteAction,
  DiscardChangesAction,
  DuplicateAction,
  PublishAction,
  UnpublishAction,
} from 'part:@sanity/base/document-actions';
import { onDocument$ } from './hooks/helper/document-subject';

const documentAllowedActions = {
  article: [
    DiscardChangesAction,
    DeleteAction,
    PublishAction,
    UnpublishAction,
    DuplicateAction,
  ],
  topicalPage: [DiscardChangesAction, PublishAction, UnpublishAction],
  overDitDashboard: [DiscardChangesAction, PublishAction, UnpublishAction],
  veelgesteldeVragen: [DiscardChangesAction, PublishAction, UnpublishAction],
  cijferVerantwoording: [DiscardChangesAction, PublishAction, UnpublishAction],
  toegankelijkheid: [DiscardChangesAction, PublishAction, UnpublishAction],
  lokalizeText: [DiscardChangesAction, PublishAction, UnpublishAction],
};

type DocumentTypes = keyof typeof documentAllowedActions;

export default function resolveDocumentActions(document: any) {
  const current = onDocument$.getValue();
  if (current?.id !== document.id) {
    onDocument$.next(document);
  }

  const allowedActions =
    documentAllowedActions[(document.type as unknown) as DocumentTypes];
  if (!allowedActions) {
    return defaultResolve(document);
  }

  return defaultResolve(document).filter(
    (action: any) => allowedActions.indexOf(action) > -1
  );
}
