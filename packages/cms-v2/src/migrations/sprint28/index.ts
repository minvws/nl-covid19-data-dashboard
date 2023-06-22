import { getClient } from '../../client';

/**
 * This migration first checks if any 'cijferVerantwoordingGroups' documents exist, if not, it creates one called 'Algemeen/General'.
 * The first of the 'cijferVerantwoordingGroups' documents is then retrieved.
 *
 * Then it changes the '_type' field for all 'cijferVerantwoording.collapsibleList' documents from 'reference' to 'cijferVerantwoordingItem' and
 * assigns the cijferVerantwoordingGroups document to the 'group' field.
 *
 * This migration can be run by executing the following command from the packages/cms directory:
 * sanity exec src/migrations/sprint28 --with-user-token
 *
 * to run the migration against the production dataset, update the client retrieval:
 * const client = getClient('production');
 *
 * (Don't forget to run 'sanity login' first and choose the 'Google' option to login with)
 */

const client = getClient('development');

const fetchFigureExplanations = () => client.fetch(`*[_type == 'cijferVerantwoordingItem' && group == null]`);
const fetchDefaultGroup = () => client.fetch(`*[_type == 'cijferVerantwoordingGroups'][0]`);

const buildPatches = (docs: any[], group: any) =>
  docs
    .map((doc) => ({
      id: doc._id,
      patch: {
        set: {
          ...doc,
          _type: 'cijferVerantwoordingItem',
          group: {
            _type: 'reference',
            _ref: group._id,
          },
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
    _type: 'cijferVerantwoordingGroups',
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

  const documents = await fetchFigureExplanations();

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
