import {
  createClient,
  createImageUrlBuilder,
  createPortableTextComponent,
  createPreviewSubscriptionHook,
  createCurrentUserHook,
} from 'next-sanity';

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  // useCdn == true gives fast, cheap responses using a globally distributed cache.
  // Set this to false if your application require the freshest possible
  // data always (potentially slightly slower and a bit more expensive).
};

/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 **/
export const urlFor = (source) => createImageUrlBuilder(config).image(source);

// Set up the live preview subsscription hook
export const usePreviewSubscription = createPreviewSubscriptionHook(config);

// Set up Portable Text serialization
export const PortableText = createPortableTextComponent({
  ...config,
  // Serializers passed to @sanity/block-content-to-react
  // (https://github.com/sanity-io/block-content-to-react)
  serializers: {},
});

// Set up the client for fetching data in the getProps page functions
export const sanityClient = createClient(config);
// Set up a preview client with serverless authentication for drafts
export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Helper function for easily switching between normal client and preview client
export const getClient = (usePreview) =>
  usePreview ? previewClient : sanityClient;

// Helper function for using the current logged in user account
export const useCurrentUser = createCurrentUserHook(config);

export function localize(value, languages) {
  if (Array.isArray(value)) {
    return value.map((v) => localize(v, languages));
  } else if (typeof value == 'object') {
    if (/^locale[A-Z]/.test(value._type)) {
      const language = languages.find((lang) => value[lang]);
      return value[language];
    }

    return Object.keys(value).reduce((result, key) => {
      result[key] = localize(value[key], languages);
      return result;
    }, {});
  }
  return value;
}

export default getClient;
