/**
 * THIS SCRIPT DELETES DATA!
 *
 * To use this script:
 * 1. Run `sanity dataset export` to backup your dataset before deleting a bunch of documents
 * 2. Run `sanity exec src/migrations/sprint43 --with-user-token` to delete the documents
 *
 * NOTE: For the time being you should not delete more than ~1000 documents in one transaction. This will change in the future.
 * See docs:https://www.sanity.io/docs/http-api/http-mutations#deleting-multiple-documents-by-query
 */

import { getClient } from '../../client';
const client = getClient('production');

const types = [
  '"article_page_article"',
  '"behavior_page"',
  '"deceased_page"',
  '"disability_care_page"',
  '"elderly_at_home_page"',
  '"nursing_home_page"',
  '"sewerPage"',
  '"topical_page"',
  '"vaccinations_page"',
];

client
  .delete({
    query: `*[_type in [${types.join(', ')}]]`,
  })
  .then(console.log)
  .catch(console.error);
