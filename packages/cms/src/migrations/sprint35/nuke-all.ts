import { getClient } from '../../client';

const client = getClient('production');

function fetchPartIds() {
  return client.fetch(/* groq */ `*[_type in ['pageArticles', 'pageHighlightedItems', 'pageLinks', 'pageRichText']]{_id}`);
}

function fetchPageIds() {
  return client.fetch(/* groq */ `*[_type in ['pageIdentifier']]{_id}`);
}

async function nukeDocuments(): Promise<any> {
  const partDocuments = await fetchPartIds();
  const partsIds = partDocuments.map((x: any) => x._id);

  await Promise.all(partsIds.map((id: string) => client.delete(id)));

  //const pageDocument = await fetchPageIds();
  //const pageIds = pageDocument.map((x: any) => x._id);

  //await Promise.all(pageIds.map((id: string) => client.delete(id)));
}

nukeDocuments().catch((err) => {
  console.error(err);
  process.exit(1);
});
