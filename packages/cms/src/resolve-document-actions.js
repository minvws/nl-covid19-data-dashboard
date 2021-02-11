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

export default function resolveDocumentActions(props) {
  const current = onDocument$.getValue();
  if (current?.id !== props.id) {
    onDocument$.next(props);
  }

  const allowedActions = documentAllowedActions[props.type];
  if (!allowedActions) {
    return defaultResolve(props);
  }

  return defaultResolve(props).filter(
    (Action) => allowedActions.indexOf(Action) > -1
  );
}
