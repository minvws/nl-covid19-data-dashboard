import { v4 as uuidv4 } from 'uuid';
import { getClient } from '../../client';

const client = getClient('migration');

// Run this script from within your project folder in your terminal with: `sanity exec --with-user-token src/migrations/sprint33/1-timeline-events-to-collections.ts`
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
  return client.fetch(/* groq */ `*[_type == 'timeSeries' && defined(timelineEvents) &&
    (!defined(timelineEventCollections) || length(timelineEventCollections) ==
    0)][0...100] {_id, timelineEvents, metricName, scope}`);
}

function createCollections(docs: any[]) {
  return Promise.all(
    docs.map(async (doc) => {
      const existingCollection = (
        await client.fetch(
          /* groq */ `*[_type == 'timelineEventCollection' && name == $name]
        { _id }`,
          {
            name: `${doc.scope} - ${titleByMetricName[doc.metricName]}`,
          }
        )
      )[0];

      if (existingCollection) {
        return {
          collection: existingCollection,
          timeSeriesId: doc._id,
        };
      }

      return {
        collection: await client.create({
          _type: 'timelineEventCollection',
          name: `${doc.scope} - ${titleByMetricName[doc.metricName]}`,
          timelineEvents: doc.timelineEvents,
        }),
        timeSeriesId: doc._id,
      };
    })
  );
}

function buildPatches(collections: { collection: any; timeSeriesId: string }[]) {
  return collections.map((collection) => ({
    id: collection.timeSeriesId,
    patch: {
      set: {
        timelineEventCollections: [
          {
            _type: 'reference',
            _key: uuidv4(),
            _ref: collection.collection._id,
          },
        ],
      },
    },
  }));
}

function createTransaction(patches: any[]) {
  return patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction());
}

async function migrateNextBatch(): Promise<any> {
  const documents = await fetchDocuments();
  const newCollections = await createCollections(documents);
  const patches = buildPatches(newCollections);
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

const titleByMetricName: Record<string, string | undefined> = {
  tested_overall: 'Positief geteste mensen',
  sewer: 'Rioolwater metingen',
  hospital_nice: 'Ziekenhuisopnames',
  intensive_care_nice: 'Intensive care-opnames',
};
