/**
 * We could provide features via the Context API, but since this doesn't change
 * at runtime I don't see any advantage doing so. An import is the most basic
 * implementation.
 */
import { assert, Feature, features } from '@corona-dashboard/common';
import { hasValueAtKey } from 'ts-is-present';

export function useFeature(name: string): Feature {
  const feature = features.find(hasValueAtKey('name', name));

  assert(
    feature,
    `[${useFeature.name}] Failed using an unknown feature: ${name}`
  );

  return feature;
}

/**
 * Wrap any `getInitialProps` function with this wrapper in order to serve a
 * 404 page when a feature is not enabled.
 */
export function withFeatureNotFoundPage<T>(name: string, getProps: T): T {
  const feature = features.find((x) => x.name === name);
  assert(
    feature,
    `[${withFeatureNotFoundPage.name}] Failed using an unknown feature: ${name}`
  );

  return feature.isEnabled
    ? getProps
    : /**
       * return a `getStaticProps` instance with { notFound: true } to return
       * a 404 status + page.
       * To prevent TS errors on the calling-context the function is cast to T.
       */
      ((() => ({ notFound: true })) as unknown as T);
}
