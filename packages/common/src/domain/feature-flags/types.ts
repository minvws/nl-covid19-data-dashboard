export interface Feature {
  name: string;
  isEnabled: boolean;

  /**
   * If it is not clear what this feature does from the name, you can leave some
   * text here.
   */
  description?: string;

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

  /**
   * The route to filter from the sitemap when this feature is disabled. I don't
   * think we'll need to have more than one route per feature as this is quite
   * rare. And you can always choose to define multiple features if you need to
   * cover multiple routes.
   */
  route?: string;
}

export type MetricScope = 'in' | 'nl' | 'vr' | 'gm';
export type JsonDataScope =
  | MetricScope
  | 'in_collection'
  | 'vr_collection'
  | 'gm_collection';
