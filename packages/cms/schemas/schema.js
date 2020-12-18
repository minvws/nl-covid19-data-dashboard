// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// documents are items that are published/queriable
import siteSettings from "./documents/siteSettings";
import laatsteOntwikkelingen from "./documents/laatste-ontwikkelingen";
import categories from "./documents/category";
import post from "./documents/post";
import veelgesteldeVragen from "./documents/veelgestelde-vragen";
import cijferVerantwoording from "./documents/cijfer-verantwoording";
import overDitDashboard from "./documents/over-dit-dashboard";
import overRisicoNiveaus from "./documents/over-risico-niveaus";

//objects are building blocks, but not queryable in itself
import localeString from "./locale-string";
import localeBlock from "./locale-block";
import openGraph from "./objects/open-graph";
import mainImage from "./objects/main-image";
import collapsible from "./objects/collapsible";

// things we need to remove from the db
import staticMessage from "./documents/static-message";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    //documents
    siteSettings,
    laatsteOntwikkelingen,
    categories,
    post,
    veelgesteldeVragen,
    cijferVerantwoording,
    overDitDashboard,
    overRisicoNiveaus,
    staticMessage,
    //objects
    localeString,
    localeBlock,
    openGraph,
    mainImage,
    collapsible,
  ]),
});
