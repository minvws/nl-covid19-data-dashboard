// First, we must import the schema creator
// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';
import createSchema from 'part:@sanity/base/schema-creator';
/**
 * Import the ones using named exports
 */
import * as allDocuments from './documents';
import * as localeHelpers from './locale';
import * as allObjects from './objects';
import * as restrictionDocuments from './restrictions';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    ...Object.values(allDocuments),

    ...Object.values(restrictionDocuments),

    ...Object.values(allObjects),

    ...Object.values(localeHelpers),
  ]),
});
