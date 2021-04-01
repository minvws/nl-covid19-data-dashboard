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
};

type DocumentNames = keyof typeof documentAllowedActions;

export default function resolveDocumentActions(props: any) {
  const current = onDocument$.getValue();
  if (current?.id !== props.id) {
    onDocument$.next(props);
  }

  const allowedActions =
    documentAllowedActions[(props.type as unknown) as DocumentNames];
  if (!allowedActions) {
    return defaultResolve(props);
  }

  return defaultResolve(props).filter(
    (action: any) => allowedActions.indexOf(action) > -1
  );
}
