// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// documents are items that are published/queriable
// some of these are 'singletons' but that's not enforced by the API
// import siteSettings from "./documents/siteSettings";
import artikel from "./documents/artikel";
import cijferVerantwoording from "./documents/cijfer-verantwoording";
import laatsteOntwikkelingen from "./documents/laatste-ontwikkelingen";
import overDitDashboard from "./documents/over-dit-dashboard";
import overRisicoNiveaus from "./documents/over-risico-niveaus";
import veelgesteldeVragen from "./documents/veelgestelde-vragen";

//objects are building blocks, but not queryable in itself
// import openGraph from "./objects/open-graph";
import collapsible from "./objects/collapsible";
import lineChart from "./objects/line-chart";

// These 2 locale helpers are technically objects too, but we keep them grouped here
// so it's easier to scan over the different imports and recognize patterns
import localeString from "./locale/locale-string";
import localeBlock from "./locale/locale-block";
import localeRichContentBlock from "./locale/locale-rich-content-block";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    /* DOCUMENTS */
    // siteSettings,
    artikel,
    laatsteOntwikkelingen,
    veelgesteldeVragen,
    cijferVerantwoording,
    overRisicoNiveaus,
    overDitDashboard,
    /* OBJECTS */
    // openGraph,
    lineChart,
    collapsible,
    /* LOCALE HELPERS */
    localeString,
    localeBlock,
    localeRichContentBlock,
  ]),
});
