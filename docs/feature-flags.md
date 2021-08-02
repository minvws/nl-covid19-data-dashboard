# Feature Flags

Feature flags are used to quickly turn newly developed features on or off,
because decisions about whether or not to release a feature can change rapidly.
Using a flag enables us to change the inclusion of a feature with a minimal
change in code. Once the feature has been released and is considered stable we
will remove the flag related logic for it.

## Definition

All feature flags are defined in `package/app/src/config/features.ts`. Below is
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

export type MetricScope = 'in' | 'nl' | 'vr' | 'gm';
export type JsonDataScope =
  | MetricScope
  | 'in_collection'
  | 'vr_collection'
  | 'gm_collection';
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

It is only possible to toggle features when the data is defined as optional in
our schema's, but as a result our standard validation doesn't warn us when data
is missing.

To solve this we run an extra build-time feature validation to ensure that:

- Data for features that are enabled should be present in the dataset
- Data for features that are disabled should _not_ be present in the dataset

For this reason it is important to declare what data belongs to the feature, via
the options `dataScopes`, `metricName` and optionally `metricProperty`.

You can only define one metricName per feature, so if a feature spans multiple
types of metric data, you will have to work around it by defining multiple
feature flags.

If the feature is only covering specific properties that were added to an
already existing metric, then declaring those properties will mean that only the
checks are performed on those. If the whole schema / metric is new, as it often
is, then specifying only the `metricName` is sufficient.

The script that validates the features (and runs at build-time) can be
triggered locally with `yarn workspace@corona-dashboard/cli validate-features`.
