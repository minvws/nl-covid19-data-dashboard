import { getClient } from '../../client';

const client = getClient();

const fetchVerantwoording = () =>
  client.fetch(`*[_type == 'cijferVerantwoording']`);

const buildPatches = (docs: any[], collapsibleDocuments: any[]) => {
  return docs
    .map((doc) => ({
      id: doc._id,
      patch: {
        set: {
          collapsibleList: collapsibleDocuments.map((x: any) => ({
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
};

const createTransaction = (patches: any[]) =>
  patches.reduce(
    (tx, patch) => tx.patch(patch.id, patch.patch),
    client.transaction()
  );

const commitTransaction = (tx: any) => tx.commit();

const saveCollapsiblesAsDocuments = (collapsibleObjects: any[]) => {
  return Promise.all(
    collapsibleObjects
      .filter((x) => x._type === 'collapsible')
      .map((x) =>
        client.create({
          ...x,
          _type: 'cijferVerantwoordingItem',
          _key: undefined,
        })
      )
  );
};

const migrateNextBatch = async (): Promise<any> => {
  const pages = await fetchVerantwoording();

  const collapsibles =
    pages.length === 1
      ? pages[0].questions
      : pages.find((x: any) => x._id.startsWith('drafts.'))?.collapsibleList;

  const collapsibleDocuments = await saveCollapsiblesAsDocuments(collapsibles);

  const patches = collapsibleDocuments.length
    ? buildPatches(pages, collapsibleDocuments)
    : [];

  if (patches.length === 0) {
    console.log('No more documents to migrate!');
    return null;
  }

  console.log(
    `Migrating batch:\n %s`,
    patches
      .map((patch: any) => `${patch.id} => ${JSON.stringify(patch.patch)}`)
      .join('\n')
  );
  const transaction = createTransaction(patches);

  await commitTransaction(transaction);

  return migrateNextBatch();
};

migrateNextBatch().catch((err: any) => {
  console.error(err);
  process.exit(1);
});
