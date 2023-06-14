import { DocumentActionComponent, DocumentActionsContext, NewDocumentCreationContext, TemplateResponse } from 'sanity';
import { isAdmin } from './roles';

// Removes lokalize from the global "create new" interface at the top left of the navigation bar.
export const newDocumentOptions = (prev: TemplateResponse[], { creationContext }: { creationContext: NewDocumentCreationContext }) => {
  if (creationContext.type === 'global') {
    return prev.filter((templateItem) => templateItem.templateId !== 'lokalizeText');
  }

  return prev;
};

export const actions = (prev: DocumentActionComponent[], context: DocumentActionsContext) => {
  const { schemaType, currentUser, dataset } = context;
  const isDeletionAllowed = schemaType === 'lokalizeText' && dataset === 'development' && isAdmin(currentUser);
  // const allowedActions: DocumentActionComponent['action'][] = [isDeletionAllowed ? 'duplicate' : 'delete', 'duplicate'];
  const disAllowedActions: DocumentActionComponent['action'][] = isDeletionAllowed ? ['duplicate'] : ['delete', 'duplicate'];

  // TODO: consider if the below commented out schemas are also required
  switch (schemaType) {
    // Individual pages
    case 'overDitDashboard':
    case 'toegankelijkheid':
    case 'contact':
    // 'Grouped' pages
    case 'cijferVerantwoording':
    case 'cijferVerantwoordingGroups':
    case 'veelgesteldeVragen':
    case 'veelgesteldeVragenGroups':
    case 'notFoundPagesCollection':
    // case 'notFoundPageItem':
    // case 'notFoundPageLinks':
    case 'topicalPageConfig':
    case 'weeklySummary':
    // case 'weeklySummaryItem':
    case 'thermometer':
    // case 'thermometerLevel':
    // case 'thermometerTimelineEvent':
    case 'theme':
    // case 'themeTile':
    case 'advice':
    case 'lokalizeText':
      /**
       * Should ensure that the user can only update and (un)publish, but not create Lokalize keys.
       * Deletion of lokalize keys is possible only if you are an Admin and on the development dataset.
       */
      return prev.filter((prevContext) => !disAllowedActions.includes(prevContext.action));
  }

  return prev;
};
