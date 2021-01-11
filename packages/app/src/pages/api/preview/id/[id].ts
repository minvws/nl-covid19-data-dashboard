import { NextApiRequest, NextApiResponse } from 'next';

import { getClient } from '~/lib/sanity';

export async function getPreviewPageById(id: string | string[]) {
  const data = await getClient(true).fetch(
    `*[_id == $id] | order(date desc){
        ...
      }`,
    { id }
  );
  return data[0];
}

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS

  if (req.query.secret !== process.env.SANITY_PREVIEW_SECRET || !req.query) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const post = await getPreviewPageById(req.query.id);

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: 'Invalid ID' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: `/${post.slug.current}` });
  res.end();
}
