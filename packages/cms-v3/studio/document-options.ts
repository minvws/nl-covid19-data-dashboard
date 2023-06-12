import { DocumentActionComponent, NewDocumentCreationContext, TemplateResponse } from 'sanity';

// Removes lokalize from the global "create new" interface at the top left of the navigation bar.
export const newDocumentOptions = (prev: TemplateResponse[], { creationContext }: { creationContext: NewDocumentCreationContext }) => {
  if (creationContext.type === 'global') {
    return prev.filter((templateItem) => templateItem.templateId !== 'lokalizeText');
  }

  return prev;
};

export const actions = (prev: DocumentActionComponent[], { schemaType }: { schemaType: string }) => {
  let allowedActions: DocumentActionComponent['action'][] = [];

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
    // TODO: Make lokalizeText deletable only if Admin and Development Dataset.
    case 'lokalizeText':
      // Should ensure that the user can only update and (un)publish, but not create or delete Lokalize keys.
      allowedActions = ['delete', 'duplicate'];
      return prev.filter((context) => {
        return !allowedActions.includes(context.action!);
      });
  }

  return prev;
};
