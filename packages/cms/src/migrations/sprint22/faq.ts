import { getClient } from '../../client';

const client = getClient();

const fetchFAQ = () => client.fetch(`*[_type == 'veelgesteldeVragen']`);

const buildPatches = (docs: any[], faqDocuments: any[]) => {
  return docs
    .map((doc) => ({
      id: doc._id,
      patch: {
        set: {
          questions: faqDocuments.map((x: any) => ({
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

const saveFaqQuestionsAsDocuments = (questionObjects: any[]) => {
  return Promise.all(
    questionObjects
      .filter((x) => x._type === 'faqQuestion')
      .map((x) =>
        client.create({
          ...x,
          _key: undefined,
        })
      )
  );
};

const migrateNextBatch = async (): Promise<any> => {
  const faqs = await fetchFAQ();

  const questions =
    faqs.length === 1
      ? faqs[0].questions
      : faqs.find((x: any) => x._id.startsWith('drafts.'))?.questions;

  const faqDocuments = await saveFaqQuestionsAsDocuments(questions);

  const patches = faqDocuments.length ? buildPatches(faqs, faqDocuments) : [];

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
