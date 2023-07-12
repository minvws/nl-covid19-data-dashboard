import sanityClient, { ClientConfig } from '@sanity/client';

const clientConfig: ClientConfig = {
  apiVersion: '2021-03-25',
  projectId: '5mog5ask',
  useCdn: false,
};

export function getClient(dataset = 'development') {
  return sanityClient({
    ...clientConfig,
    dataset,
  });
}
