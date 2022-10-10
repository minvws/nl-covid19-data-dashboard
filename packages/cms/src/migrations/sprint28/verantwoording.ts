import { getClient } from '../../client';

const OLD_TYPE = 'figureExplanationItem';
const NEW_TYPE = 'cijferVerantwoordingItem';

const client = getClient('production');

const fetchDocuments = () => client.fetch(`*[_type == $oldType] {..., "incomingReferences": *[references(^._id)]{...}}`, { oldType: OLD_TYPE });

const buildMutations = (docs: any[]) => {
  const mutations: any[] = [];

  docs.forEach((doc) => {
    // Updating an document _type field isn't allowed, we have to create a new and delete the old
    const newDocId = `${doc._id}-migrated`;
    const newDocument = { ...doc, ...{ _id: newDocId, _type: NEW_TYPE } };
    delete newDocument.incomingReferences;
    delete newDocument._rev;

    mutations.push({ create: newDocument });

    // Apply the delete mutation after references have been changed
    mutations.push({ delete: doc._id });
  });

  return mutations.filter(Boolean);
};

const createTransaction = (mutations: any[]) => {
  return mutations.reduce((tx: any, mutation: any) => {
    if (mutation.patch) {
      return tx.patch(mutation.id, mutation.patch);
    }
    if (mutation.delete) {
      return tx.delete(mutation.delete);
    }
    if (mutation.create) {
      return tx.createIfNotExists(mutation.create);
    }
  }, client.transaction());
};

const migrateNextBatch: any = async () => {
  const documents = await fetchDocuments();
  if (documents.length === 0) {
    console.log('No more documents to migrate!');
    return null;
  }
  const mutations = buildMutations(documents);
  const creations = mutations.filter((x) => x.create);
  const patches = mutations.filter((x) => x.patch);
  const deletions = mutations.filter((x) => x.delete);
  const transaction = createTransaction(creations.concat(patches).concat(deletions));

  await transaction.commit();
  return migrateNextBatch();
};

migrateNextBatch().catch((err: any) => {
  console.error(JSON.stringify(err, null, 2));
  process.exit(1);
});
