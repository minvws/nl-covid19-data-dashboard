# Feature Flags

Feature flags are used to quickly turn newly developed features on or off,
because decisions about whether or not to release a feature can change rapidly.
Using a flag enables us to change the inclusion of a feature with a minimal
change in code. Once the feature has been released and is considered stable we
will remove the flag related logic for it.

## Definition

All feature flags are defined in `packages/common/src/feature-flags/features.ts`. Below is
the type definition for a feature flag:

```ts
export interface Feature {
  name: string;
  isEnabled: boolean;

  /**
   * Metric scope defines the files in which we enforce the (non-)existence of
   * metricNames.
   */
  dataScopes?: JsonDataScope[];

  /**
   * A metricName is the root-level schema property used to hold the data in the
   * NL/VR/GM files. By limiting a feature to only 1 metric name, we can keep
   * the code and API simple. If your feature is using more than one metric
   * name, simply split it into multiple named features.
   */
  metricName?: string;

  /**
   * If the feature was built on new metric properties of an existing metric
   * name then you can use this field to enforce the (non)existence of only
   * those properties. The metric name will still be allowed to exist when this
   * feature is disabled.
   */
  metricProperties?: string[];
}

export type JsonDataScope = DataScopeKey | 'vr_collection' | 'gm_collection';
```

## Usage

After a flag has been configured it can be used like this:

```ts
const someFeature = useFeature('someFeatureName');

if (someFeature.isEnabled) {
  ...
}
```

If the feature contains a new page, the route should return a 404 when the
feature is disabled. To achieve this we use a wrapper function for
getStaticProps:

```ts
export const getStaticProps = withFeatureNotFoundPage(
  'someFeatureName',
  createGetStaticProps()
);
```

## Validation

In `create-validate-function.ts` the feature flags are loaded as well, and based
on this information the specified metrics are removed from the required list.
Making them effectively optional at validation time. But required during the
typescript generation. So, that way a feature can be turned off while the compiler
remains happy and you don't need to riddle your code with undefined checks.

For this reason it is important to declare what data belongs to the feature, via
the options `dataScopes`, `metricName` and optionally `metricProperty`.

You can only define one metricName per feature, so if a feature spans multiple
types of metric data, you will have to work around it by defining multiple
feature flags.

If the feature is only covering specific properties that were added to an
already existing metric, then declaring those properties will mean that only the
checks are performed on those. If the whole schema / metric is new, as it often
is, then specifying only the `metricName` is sufficient.

[Back to index](index.md)
