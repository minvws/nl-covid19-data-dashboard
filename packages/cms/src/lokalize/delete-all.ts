import { getClient } from '../client';

(async function run() {
  const client = getClient();

  client.fetch(`*[_type == 'lokalizeText']`).then((result: any[]) => {
    const transaction = client.transaction();

    result.forEach((document) => transaction.delete(document._id));

    transaction.commit().catch((err) => {
      console.error(`Failed to delete documents: ${err.message}`);
      process.exit(1);
    });
  });
})().catch((err) => {
  console.error(`Delete all failed: ${err.message}`);
  process.exit(1);
});
