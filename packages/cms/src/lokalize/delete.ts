import Queue from 'p-queue';
import { client } from '../client';

const queue = new Queue({
  concurrency: 4,
  interval: 1000 / 25,
});

client.fetch(`*[_type == 'lokalizeSubject']`).then((result: any[]) => {
  for (const document of result) {
    queue.add(() =>
      client
        .delete(document._id)
        .then(() => console.log(`Deleted document ${document._id}`))
        .catch((err) =>
          console.error(
            `Failed to delete document ${document._id}: ${err.message}`
          )
        )
    );
  }
});
