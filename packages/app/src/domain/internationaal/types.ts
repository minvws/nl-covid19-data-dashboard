import { PickByType } from '@corona-dashboard/common';
import { International } from '~/pages/internationaal/positief-geteste-mensen';

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
export type InternationalLists = PickByType<International, unknown[]>;
export type InternationalListKey = keyof InternationalLists;
export type InternationalListType =
  InternationalLists[InternationalListKey][number];
