import defaultResolve, { DeleteAction, DiscardChangesAction, DuplicateAction, PublishAction, UnpublishAction } from 'part:@sanity/base/document-actions';
import { DocumentActionProps, PublishOrAcceptAction } from './actions';
import { onDocument$ } from './hooks/helper/document-subject';
import * as documents from './schemas/documents';

/**
 * Actions are shown in this order, so the Publish button is the default
 */
const defaultPublishingActions = [PublishAction, DiscardChangesAction, UnpublishAction];

/**
 * Here we set the default actions on all documents
 */
const documentsWithDefaultActions = Object.values(documents).reduce((pages, schema) => ({ ...pages, [schema.name]: defaultPublishingActions }), {});

/**
 * And here we override some of them while constructing the actual lookup
 */
const actionsByDocumentType = {
  ...documentsWithDefaultActions,
  article: [PublishAction, DiscardChangesAction, UnpublishAction, DuplicateAction, DeleteAction],
  lokalizeText: [PublishOrAcceptAction, DiscardChangesAction, PublishAction, UnpublishAction],
  faqQuestion: [PublishAction, DiscardChangesAction, UnpublishAction, DuplicateAction, DeleteAction],
  cijferVerantwoordingItem: [PublishAction, DiscardChangesAction, UnpublishAction, DuplicateAction, DeleteAction],
  chartConfiguration: [PublishAction, DiscardChangesAction, UnpublishAction, DuplicateAction, DeleteAction],
  kpiConfiguration: [PublishAction, DiscardChangesAction, UnpublishAction, DuplicateAction, DeleteAction],
  pageIdentifier: [PublishAction, DiscardChangesAction, UnpublishAction, DuplicateAction, DeleteAction],
  pageArticles: [PublishAction, DiscardChangesAction, UnpublishAction, DuplicateAction, DeleteAction],
  pageHighlightedItems: [PublishAction, DiscardChangesAction, UnpublishAction, DuplicateAction, DeleteAction],
  pageLinks: [PublishAction, DiscardChangesAction, UnpublishAction, DuplicateAction, DeleteAction],
  pageRichText: [PublishAction, DiscardChangesAction, UnpublishAction, DuplicateAction, DeleteAction],
};

type DocumentType = keyof typeof actionsByDocumentType;

export default function resolveDocumentActions(document: DocumentActionProps) {
  /**
   * This is placing the current document on the observer that is driving
   * the useCurrentDocument hook. This hook is used for the language switcher.
   *
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
