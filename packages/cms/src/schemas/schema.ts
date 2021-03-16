// First, we must import the schema creator
// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';
import createSchema from 'part:@sanity/base/schema-creator';
// documents are items that are published/queriable
// some of these are 'singletons' but that's not enforced by the API
// import siteSettings from "./documents/siteSettings";
import article from './documents/article';
import editorial from './documents/editorial';
import behaviorPage from './documents/pages/behavior-page';
import cijferVerantwoording from './documents/pages/cijfer-verantwoording-page';
import deceasedPage from './documents/pages/deceased-page';
import escalationLevelPage from './documents/pages/escalation-level-page';
import hospitalPage from './documents/pages/hospital-page';
import intensiveCarePage from './documents/pages/intensive-care-page';
import overDitDashboard from './documents/pages/over-dit-dashboard-page';
import overRisicoNiveaus from './documents/pages/over-risico-niveaus-page';
import positiveTestsPage from './documents/pages/positive-tests-page';
import reproductionPage from './documents/pages/reproduction-page';
import sewerPage from './documents/pages/sewer-page';
import topicalPage from './documents/pages/topical-page';
import vaccinationsPage from './documents/pages/vaccinations-page';
import veelgesteldeVragenGroepen from './documents/pages/veelgestelde-vragen-groepen-page';
import veelgesteldeVragen from './documents/pages/veelgestelde-vragen-page';
import toegankelijkheid from './documents/toegankelijkheid';
import localeBlock from './locale/locale-block';
import localeRichContentBlock from './locale/locale-rich-content-block';
// These 2 locale helpers are technically objects too, but we keep them grouped here
// so it's easier to scan over the different imports and recognize patterns
import localeString from './locale/locale-string';
import localeText from './locale/locale-text';
//objects are building blocks, but not queryable in itself
import collapsible from './objects/collapsible';
import faqQuestion from './objects/faq-question';
import lineChart from './objects/line-chart';
import milestone from './objects/milestone';
import lockdown from './restrictions/lockdown';
import restriction from './restrictions/restriction';
import restrictionCategory from './restrictions/restriction-category';
// routekaart en maatregelen
import restrictionGroup from './restrictions/restriction-group';
import restrictionGroupLockdown from './restrictions/restriction-group-lockdown';
import roadmap from './restrictions/roadmap';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    /* DOCUMENTS */
    article,
    editorial,
    veelgesteldeVragen,
    veelgesteldeVragenGroepen,
    cijferVerantwoording,
    overRisicoNiveaus,
    overDitDashboard,
    toegankelijkheid,
    topicalPage,
    deceasedPage,
    escalationLevelPage,
    behaviorPage,
    hospitalPage,
    intensiveCarePage,
    positiveTestsPage,
    reproductionPage,
    sewerPage,
    vaccinationsPage,

    /** RESTRICTIONS */
    restrictionGroup,
    restrictionGroupLockdown,
    restrictionCategory,
    roadmap,
    lockdown,
    restriction,

    /* OBJECTS */
    lineChart,
    collapsible,
    milestone,
    faqQuestion,

    /* LOCALE HELPERS */
    localeString,
    localeBlock,
    localeRichContentBlock,
    localeText,
  ]),
});
