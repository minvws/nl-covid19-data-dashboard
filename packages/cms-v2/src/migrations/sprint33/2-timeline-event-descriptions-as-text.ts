import { getClient } from '../../client';

const client = getClient('migration');

// Run this script from within your project folder in your terminal with: `sanity exec --with-user-token src/migrations/sprint33/2-timeline-event-descriptions-as-text.ts`
//
// This example shows how you may write a migration script that renames a field (name => fullname)
// on a specific document type (author).
// This will migrate documents in batches of 100 and continue patching until no more documents are
// returned from the query.
//
// This script can safely be run, even if documents are being concurrently modified by others.
// If a document gets modified in the time between fetch => submit patch, this script will fail,
// but can safely be re-run multiple times until it eventually runs out of documents to migrate.

// A few things to note:
// - This script will exit if any of the mutations fail due to a revision mismatch (which means the
//   document was edited between fetch => update)
// - The query must eventually return an empty set, or else this script will continue indefinitely

// Fetching documents that matches the precondition for the migration.
// NOTE: This query should eventually return an empty set of documents to mark the migration
// as complete
function fetchDocuments() {
  return client.fetch(
    /* groq */ `*[_type == 'timelineEventCollection' && defined(timelineEvents) && timelineEvents[0].description._type == 'localeString'][0...100]{_id, timelineEvents}`
  );
}

function buildPatches(collections: any[]) {
  return collections.map((collection) => ({
    id: collection._id,
    patch: {
      set: {
        timelineEvents: changeEventDescriptionsToLocaleText(collection.timelineEvents),
      },
    },
  }));
}

function createTransaction(patches: any[]) {
  return patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction());
}

function changeEventDescriptionsToLocaleText(events: any) {
  return events.map((e: any) => ({
    ...e,
    description: { ...e.description, _type: 'localeText' },
  }));
}

async function migrateNextBatch(): Promise<any> {
  const documents = await fetchDocuments();
  const patches = buildPatches(documents);
  if (patches.length === 0) {
    console.log('No more documents to migrate!');
    return null;
  }
  console.log(`Migrating batch:\n %s`, patches.map((patch) => `${patch.id} => ${JSON.stringify(patch.patch)}`).join('\n'));
  const transaction = createTransaction(patches);
  await transaction.commit();
  return migrateNextBatch();
}

migrateNextBatch().catch((err) => {
  console.error(err);
  process.exit(1);
});
