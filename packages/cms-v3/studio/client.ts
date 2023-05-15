import { createClient } from '@sanity/client';

// TODO:
//  - clean this up
//  - properly type this
//  - use .env variables
//  - see if useClient hook is feasable to use
export const client = createClient({ projectId: '5mog5ask', apiVersion: '2021-10-21', dataset: undefined ?? 'development' });
