import { getClient } from '../../client';

const client = getClient();

const fetchFAQ = () => client.fetch(`*[_type == 'veelgesteldeVragen'][0]`);

const buildPatches = (docs: any[], group: any) => {
  return docs
    .map((doc) => ({
      id: doc._id,
      patch: {
        set: {
          questions: doc.questions.map((x: any) => ({
            ...x,
            _type: 'faqQuestion',
            group: {
              _type: 'reference',
              _ref: group._id,
            },
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

const migrateNextBatch = async (): Promise<any> => {
  const faq = await fetchFAQ();

  console.dir(faq);
};

migrateNextBatch().catch((err: any) => {
  console.error(err);
  process.exit(1);
});
