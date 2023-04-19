import { Gm, Nl, Vr } from '.';

/**
 * All possible datascopes. Can be used to access the types of a scope based on
 * a given scope key.
 */
export type ScopedData = {
  gm: Gm;
  nl: Nl;
  /** TODO: when this gets removed, also remove the type "DataScopeKeyForRouter".
   **  It was created for COR-1499, because the router needed to have the VR excluded.
   **  When picking up ticket COR-1504 this line scoped data should be adjusted for the validation of the VR JSONS.
   **  The clean up of "DataScopeKeyForRouter" described above needs to happen as well.
   **/
  vr: Vr;
};

export type DataScopeKeyForRouter = 'gm' | 'nl';

export type DataScopeKey = keyof ScopedData;

export type DataScope = ScopedData[DataScopeKey];

export type MetricKeys<T> = keyof Omit<T, 'last_generated' | 'proto_name' | 'name' | 'code'>;

export type MetricName = MetricKeys<Nl & Vr & Gm>;

type ValuesMetric<T> = {
  values: T[];
};

/**
 * Recursively goes down 'values' arrays, returning the keys of the lowest-level
 * value it can find. This way we can catch the properties of both 'normal'
 * values as well as grouped values (i.e. 'sewer per installation' or 'variants')
 */
type ValueKeys<T> = T extends ValuesMetric<infer V> ? ValueKeys<V> : keyof T;

/**
 * The metric properties of metric M in data scope S (scope being In/Nl/Vr/Gm)
 */
export type MetricProperty<S extends DataScope, M extends MetricKeys<S>> = ValueKeys<S[M]>;
