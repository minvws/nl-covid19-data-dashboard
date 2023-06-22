/**
 * THIS SCRIPT DELETES DATA!
 *
 * To use this script:
 * 1. Run `sanity dataset export` to backup your dataset before deleting a bunch of documents
 * 2. Run `sanity exec src/migrations/sprint59 --with-user-token` to delete the documents
 *
 * NOTE: For the time being you should not delete more than ~1000 documents in one transaction. This will change in the future.
 * See docs:https://www.sanity.io/docs/http-api/http-mutations#deleting-multiple-documents-by-query
 */

import { getClient } from '../../client';
const client = getClient('development');

client
  .delete({
    query: `*[_type == "lokalizeText" && [_id] match "c39981a1-bfa4-4aec-bf65-f0143820e150"]`,
  })
  .then(console.log)
  .catch(console.error);
