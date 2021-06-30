import { InCollection, PickByType } from '@corona-dashboard/common';

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

// First we extract all of the properties that have an array type
export type InCollectionArrayProps = PickByType<InCollection, unknown[]>;
// Then we extract the key names for these properties
export type InCollectionArrayKeys = keyof InCollectionArrayProps;
// And lastly we extract the types of all the value lists
export type InCollectionArrayType =
  InCollectionArrayProps[InCollectionArrayKeys][number];
