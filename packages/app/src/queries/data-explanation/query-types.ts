import { PortableTextEntry } from '@sanity/block-content-to-react';
import { DataExplainedGroup } from '~/types/cms';

interface DataExplainedDictionary<T> {
  [index: string]: T;
}

export type DataExplainedItem = {
  title: string;
  slug: { current: string };
  content: PortableTextEntry[];
  icon: string;
};

export type DataExplainedGroups = DataExplainedDictionary<[DataExplainedGroup, ...DataExplainedGroup[]]>;
