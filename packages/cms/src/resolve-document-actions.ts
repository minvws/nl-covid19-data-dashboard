import defaultResolve, {
  DeleteAction,
  DiscardChangesAction,
  DuplicateAction,
  PublishAction,
  UnpublishAction,
} from 'part:@sanity/base/document-actions';
import { PublishOrAcceptAction, DocumentActionProps } from './actions';
import { onDocument$ } from './hooks/helper/document-subject';

const actionsByDocumentType = {
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
  lokalizeText: [
    PublishOrAcceptAction,
    DiscardChangesAction,
    PublishAction,
    UnpublishAction,
  ],
};

type DocumentType = keyof typeof actionsByDocumentType;

export default function resolveDocumentActions(document: DocumentActionProps) {
  /**
   * This is placing the current document on the observer that is driving
   * the useCurrentDocument hook. This hook is used for the language switcher.
   * At the time this was the only way to get a hold of the document. Possibly
   * there is now an official way to achieve this @TODO find out.
   */
  const current = onDocument$.getValue();
  if (current?.id !== document.id) {
    onDocument$.next(document);
  }

  const definedActions = actionsByDocumentType[document.type as DocumentType];

  return definedActions ? definedActions : defaultResolve(document);
}
