import { getClient } from './sanity';

export async function getPreviewPageBySlug(slug: string | string[]) {
  const data = await getClient(true).fetch(
    `*[slug.current == $slug] | order(date desc){
        ...
      }`,
    { slug }
  );
  return data[0];
}
