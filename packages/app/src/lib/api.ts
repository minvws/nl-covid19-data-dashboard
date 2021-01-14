import { getPreviewClient } from './sanity';

export async function getPreviewPageBySlug<T>(slug: string | string[]) {
  const data = await getPreviewClient().fetch<T[]>(
    `*[slug.current == $slug] | order(date desc){
        ...
      }`,
    { slug }
  );
  return data[0] as T | undefined;
}
