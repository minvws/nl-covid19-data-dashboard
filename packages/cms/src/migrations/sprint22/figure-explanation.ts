import { v4 as uuidv4 } from 'uuid';
import { getClient } from '../../client';

const client = getClient();

function buildPatches(docs: any[], figureExplanationItems: any[]) {
  return docs
    .map((doc) => ({
      id: doc._id,
      patch: {
        set: {
          collapsibleList: figureExplanationItems.map((x: any) => ({
            _type: 'reference',
            _ref: x._id,
          })),
        },
        // this will cause the transaction to fail if the documents has been
        // modified since it was fetched.
        ifRevisionID: doc._rev,
      },
    }))
    .filter((x) => x !== undefined);
}

function createTransaction(patches: any[]) {
  return patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction());
}

function saveCollapsiblesAsDocuments(collapsibleObjects: any[]) {
  return Promise.all(
    collapsibleObjects
      .filter((x) => x._type === 'collapsible')
      .map((x) =>
        client.create({
          ...x,
          _type: 'figureExplanationItem',
          _key: uuidv4(),
        })
      )
  );
}

async function migrateNextBatch(): Promise<any> {
  const pages = await client.fetch(`*[_type == 'cijferVerantwoording']`);

  const collapsibles = pages.length === 1 ? pages[0].collapsibleList : pages.find((x: any) => x._id.startsWith('drafts.'))?.collapsibleList;

  const collapsibleDocuments = await saveCollapsiblesAsDocuments(collapsibles);

  const patches = collapsibleDocuments.length ? buildPatches(pages, collapsibleDocuments) : [];

  if (patches.length === 0) {
    console.log('No more documents to migrate!');
    return null;
  }

  console.log(`Migrating batch:\n %s`, patches.map((patch: any) => `${patch.id} => ${JSON.stringify(patch.patch)}`).join('\n'));

  const transaction = createTransaction(patches);
  await transaction.commit();

  return migrateNextBatch();
}

migrateNextBatch().catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
