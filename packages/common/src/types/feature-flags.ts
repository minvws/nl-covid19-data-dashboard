import { DataScopeKey } from '.';

export function isSimpleFeature(feature: Feature): feature is SimpleFeature {
  return !('dataScopes' in feature);
}

export function isVerboseFeature(feature: Feature): feature is VerboseFeature {
  return 'dataScopes' in feature;
}

export type Feature = SimpleFeature | VerboseFeature;

export type SimpleFeature = {
  name: string;
  isEnabled: boolean;
};

export type VerboseFeature = {
  /**
   * Metric scope defines the files in which we enforce the (non-)existence of
   * metricNames.
   */
  dataScopes: JsonDataScope[];

  /**
   * A metricName is the root-level schema property used to hold the data in the
   * NL/VR/GM files. By limiting a feature to only 1 metric name, we can keep
   * the code and API simple. If your feature is using more than one metric
   * name, simply split it into multiple named features.
   */
  metricName: string;

  /**
   * If the feature was built on new metric properties of an existing metric
   * name then you can use this field to enforce the (non)existence of only
   * those properties. The metric name will still be allowed to exist when this
   * feature is disabled.
   */
  metricProperties?: string[];
} & SimpleFeature;

export type JsonDataScope = DataScopeKey | 'vr_collection' | 'gm_collection' | 'archived_gm_collection';
