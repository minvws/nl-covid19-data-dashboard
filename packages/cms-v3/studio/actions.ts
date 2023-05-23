import { DocumentActionComponent } from 'sanity';

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
    case 'lokalizeText':
      // Should ensure that the user can only update and (un)publish, but not create or delete Lokalize keys.
      allowedActions = ['delete', 'duplicate'];
      return prev.filter(({ action }) => !allowedActions.includes(action!));
  }

  return prev;
};
