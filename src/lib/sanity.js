import sanityClient from '@sanity/client';

const options = {
  // Find your project ID and dataset in `sanity.json` in your studio project
  dataset: 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  // useCdn == true gives fast, cheap responses using a globally distributed cache.
  // Set this to false if your application require the freshest possible
  // data always (potentially slightly slower and a bit more expensive).
};

const client = sanityClient(options);

export const previewClient = sanityClient({
  ...options,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

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

export default client;
