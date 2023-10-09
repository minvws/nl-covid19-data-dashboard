import { DocumentActionComponent, DocumentActionsContext, NewDocumentCreationContext, TemplateResponse } from 'sanity';
import { isAdmin } from '../roles';
import { PublishOrAcceptAction } from './custom-actions/publish-or-accept';

// Removes lokalize from the global "create new" interface at the top left of the navigation bar.
export const newDocumentOptions = (prev: TemplateResponse[], { creationContext }: { creationContext: NewDocumentCreationContext }) => {
  // Removes the button visually from the header
  window.document.querySelector('style')?.append('[data-ui="Navbar"] button[aria-label^="Create new document"] {display: none}');

  if (creationContext.type === 'structure' || creationContext.type === 'global') {
    return prev.filter((templateItem) => templateItem.templateId !== 'lokalizeText');
  }

  return prev;
};

export const actions = (prev: DocumentActionComponent[], context: DocumentActionsContext) => {
  const { schemaType, currentUser, dataset } = context;
  const defaultActions: DocumentActionComponent['action'][] = ['publish', 'unpublish', 'discardChanges'];

  switch (schemaType) {
    // Lokalize text is treated differently as it has a different publish action.
    case 'lokalizeText': {
      const disAllowedActions: DocumentActionComponent['action'][] = isAdmin(currentUser) && dataset === 'development' ? ['duplicate'] : ['delete', 'duplicate'];
      const lokalizeSpecificActions = [PublishOrAcceptAction, ...prev];

      // Allows all actions except duplicate, (and delete if not Admin), also injects custom publish action for new lokalize documents.
      return lokalizeSpecificActions.filter((prevContext) => !disAllowedActions.includes(prevContext.action));
    }

    // Document types which have all actions enabled.
    case 'article':
    case 'cijferVerantwoordingItem':
    case 'faqQuestion':
    case 'notFoundPageItem':
    case 'notFoundPageLinks':
    case 'pageArticles':
    case 'pageFAQs':
    case 'pageHighlightedItems':
    case 'pageIdentifier':
    case 'pageLinks':
    case 'pageDataExplained':
    case 'pageRichText':
    case 'themeTile':
    case 'veelgesteldeVragen':
    case 'weeklySummaryItem':
      // Allows all actions.
      return prev;

    default:
      // Only allows default actions.
      return prev.filter((prevAction) => defaultActions.includes(prevAction.action));
  }
};
