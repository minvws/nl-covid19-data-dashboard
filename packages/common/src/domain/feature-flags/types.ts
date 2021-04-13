export interface FeatureDefinition {
  name: string;
  isEnabled: boolean;

  /**
   * If it is not clear what this feature does from the name, you can leave some
   * text here.
   */
  description?: string;

  /**
   * The route to filter from the sitemap when this feature is disabled. I don't
   * think we'll need to have more than one route per feature.
   */
  route?: string;

  /**
   * The metricProperties involved with this feature. Listing them here will
   * enforce the data being available when the feature flag is enabled. It will
   * also enforce the data to not be available when the feature is disabled.
   *
   * A metricName is the root-level schema property used to hold the data in the
   * NL/VR/GM files.
   *
   * If the feature was built on new metric properties of an existing metric
   * (name) then this field should be left blank, because we only enforce the
   * existence / non-existence of metric data on the root level.
   */
  metricNames?: string[];

  /**
   * Metric scope defines the files in which we enforce the (non-)existence of
   * metricNames. If no scope is give, all will be assumed.
   */
  metricScope?: MetricScope[];
}

type MetricScope = 'nl' | 'vr' | 'gm';
