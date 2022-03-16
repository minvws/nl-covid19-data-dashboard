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
import sanityClient from 'part:@sanity/base/client';
const client = sanityClient.withConfig({ apiVersion: 'v1' });

const types = [
  '"articlePageArticle"',
  '"behaviorPage"',
  '"deceasedPage"',
  '"disabilityCarePage"',
  '"elderlyAtHomePage"',
  '"escalationLevelPage"',
  '"internationalPage"',
  '"nursingHomePage"',
  '"vaccinationsPage"',
];

client
  .delete({
    query: `*[_type in [${types.join(', ')}]][0...999]`,
  })
  .then(console.log)
  .catch(console.error);
