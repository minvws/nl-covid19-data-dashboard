// lib/sanity.ts
import sanityClient from '@sanity/client';
import BlockContent from '@sanity/block-content-to-react';

import { TLanguageKey } from '~/locale';

const config = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  useCdn: process.env.NODE_ENV === 'production',
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
};

// Set up Portable Text serialization
export const PortableText = BlockContent;

// Set up the client for fetching data in the getProps page functions
export const client = sanityClient(config);

export function localize<T>(value: T, languages: TLanguageKey[]): T {
  const anyValue = value as any;

  if (Array.isArray(value)) {
    return (value.map((v) => localize(v, languages)) as unknown) as T;
  }

  if (typeof value == 'object' && value !== null) {
    if (/^locale[A-Z]/.test(anyValue._type)) {
      const language = languages.find((lang: string) => (value as any)[lang]);

      return (language && anyValue[language]) ?? null;
    }

    return Object.keys(anyValue).reduce(
      (result, key) => ({
        ...result,
        [key]: localize(anyValue[key], languages),
      }),
      {} as T
    );
  }
  return value;
}
