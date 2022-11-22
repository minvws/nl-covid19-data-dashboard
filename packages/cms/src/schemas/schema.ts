// First, we must import the schema creator
// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';
import createSchema from 'part:@sanity/base/schema-creator';
import * as elements from '../elements/schemas';
/**
 * Import the ones using named exports
 */
import * as documents from './documents';
import * as locale from './locale';
import * as objects from './objects';
import * as measures from './measures';
import * as topicalPageConfig from './topical';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat(
    ...Object.values(documents),
    ...Object.values(measures),
    ...Object.values(objects),
    ...Object.values(locale),
    ...Object.values(elements),
    ...Object.values(topicalPageConfig)
  ),
});
