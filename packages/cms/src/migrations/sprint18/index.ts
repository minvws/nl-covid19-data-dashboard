import client from 'part:@sanity/base/client';

/**
 * This migration first checks if any 'veelgesteldeVragenGroups' documents exist, if not, it creates one called 'Algemeen/General'.
 * The first of the 'veelgesteldeVragenGroups' documents is then retrieved.
 *
 * Then it changes the '_type' field for all 'veelgesteldeVragen.question' documents from 'collapsible' to 'faqQuestion' and
 * assigns the veelgesteldeVragenGroups document to the 'group' field.
 *
 * This migration can be run by executing the following command from the packages/cms directory:
 * sanity exec src/migrations/sprint18 --with-user-token
 *
 * to run the migration against the production dataset, prefix the command like this:
 * SANITY_STUDIO_API_DATASET=production sanity exec src/migrations/sprint18 --with-user-token
 *
 * (Don't forget to run 'sanity login' first and choose the 'Google' option to login with)
 */

const fetchFAQ = () => client.fetch(`*[_type == 'veelgesteldeVragen']`);
const fetchDefaultGroup = () => client.fetch(`*[_type == 'veelgesteldeVragenGroups'][0]`);

const buildPatches = (docs: any[], group: any) =>
  docs
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

const createTransaction = (patches: any[]) => patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction());

const commitTransaction = (tx: any) => tx.commit();

const createDefaultGroup = async () => {
  const doc = {
    _type: 'veelgesteldeVragenGroups',
    group: {
      _type: 'localeString',
      nl: 'Algemeen',
      en: 'General',
    },
  };

  return client.create(doc);
};

const migrateNextBatch = async (): Promise<any> => {
  let group = await fetchDefaultGroup();
  if (group === null) {
    group = await createDefaultGroup();
  }

  const documents = (await fetchFAQ()).filter((x: any) => x.questions.some((x: any) => x._type === 'collapsible'));

  const patches = buildPatches(documents, group);

  if (patches.length === 0) {
    console.log('No more documents to migrate!');
    return null;
  }

  console.log(`Migrating batch:\n %s`, patches.map((patch: any) => `${patch.id} => ${JSON.stringify(patch.patch)}`).join('\n'));
  const transaction = createTransaction(patches);

  await commitTransaction(transaction);

  return migrateNextBatch();
};

migrateNextBatch().catch((err: any) => {
  console.error(err);
  process.exit(1);
});
