// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// documents are items that are published/queriable
// some of these are 'singletons' but that's not enforced by the API
// import siteSettings from "./documents/siteSettings";
// import laatsteOntwikkelingen from "./documents/laatste-ontwikkelingen";
import veelgesteldeVragen from "./documents/veelgestelde-vragen";
// import cijferVerantwoording from "./documents/cijfer-verantwoording";
// import overDitDashboard from "./documents/over-dit-dashboard";
// import overRisicoNiveaus from "./documents/over-risico-niveaus";

//objects are building blocks, but not queryable in itself
// import openGraph from "./objects/open-graph";
import collapsible from "./objects/collapsible";

// These 2 locale helpers are technically objects too, but we keep them grouped here
// so it's easier to scan over the different imports and recognize patterns
import localeString from "./locale/locale-string";
import localeBlock from "./locale/locale-block";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    //documents
    // siteSettings,
    // laatsteOntwikkelingen,
    veelgesteldeVragen,
    // cijferVerantwoording,
    // overDitDashboard,
    // overRisicoNiveaus,
    //objects
    // openGraph,
    collapsible,
    //locale helpers
    localeString,
    localeBlock,
  ]),
});
