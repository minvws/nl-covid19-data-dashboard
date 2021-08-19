import { assert } from '@corona-dashboard/common';
/**
 * We could provide features via the Context API, but since this doesn't change
 * at runtime I don't see any advantage doing so. An import is the most basic
 * implementation.
 */
import { features } from '~/config';

export function useFeature(name: string) {
  const feature = features.find((x) => x.name === name);

  assert(feature, `Failed using an unknown feature: ${name}`);

  return feature;
}

/**
 * Wrap any `getInitialProps` function with this wrapper in order to serve a
 * 404 page when a feature is not enabled.
 */
export function withFeatureNotFoundPage<T>(name: string, getProps: T): T {
  const feature = features.find((x) => x.name === name);
  assert(feature, `Failed using an unknown feature: ${name}`);

  return feature.isEnabled
    ? getProps
    : /**
       * return a `getStaticProps` instance with { notFound: true } to return
       * a 404 status + page.
       * To prevent TS errors on the calling-context the function is cast to T.
       */
      ((() => ({ notFound: true })) as unknown as T);
}
