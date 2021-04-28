import Queue from 'p-queue';
import { client } from '../client';

client.fetch(`*[_type == 'lokalizeText']`).then((result: any[]) => {
  const transaction = client.transaction();
  result.forEach((document) => transaction.delete(document._id));
  transaction.commit().catch((err) => exit('Failed to delete documents', err));
});

function exit(...args: unknown[]) {
  console.error(...args);
  process.exit(1);
}
