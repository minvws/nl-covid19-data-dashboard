import { Gm, Nl } from '@corona-dashboard/common';
import React, { ReactNode } from 'react';
import { Text } from '../typography';
import { Difference } from './components/difference';
import { Metric } from './components/metric';
import { PluralizationTexts } from './logic/get-pluralized-text';

export type DataKeys = keyof Nl | keyof Gm;

/**
 * This type ensures that if a metricName of type keyof Nl is assigned,
 * the data property HAS to be of type a Pick of Nl that includes the
 * 'difference' key plus the key that was assigned to metricName.
 *
 * So, if metricName is 'vaccine_stock' then data needs to be assigned with
 * Pick<Nl, 'difference'|'vaccine_stock'>
 *
 * @TODO These types don't seem to work, as we need to use Lodash get plus
 * casting to get to them. Normal accessors give type errors. Lodash get is very
 * forgiving because it will work on any data structure.
 *
 */
export type DataFile<T> = T extends keyof Nl ? Pick<Nl, 'difference' | T> : T extends keyof Gm ? Pick<Gm, 'difference' | T> : never;

export type Content<T extends DataKeys> =
  | {
      type: 'metric';
      text: PluralizationTexts;
      differenceKey?: string;
      metricName: T;
      metricProperty: string;
      additionalData?: Record<string, ReactNode>;
      isPercentage?: boolean;
    }
  | {
      type: 'difference';
      text: string;
      differenceKey: string;
      isAmount: boolean;
      additionalData?: Record<string, ReactNode>;
    };

interface DataDrivenTextProps<T extends DataKeys, K = DataFile<T>> {
  data: K;
  content: Content<T>[];
}

export function DataDrivenText<T extends DataKeys, K = DataFile<T>>({ data, content }: DataDrivenTextProps<T, K>) {
  return (
    <Text variant="datadriven">
      {React.Children.toArray(content.map((x) => renderContent(x, data))).reduce((children: ReactNode[], child: ReactNode, index, arr) => {
        // inject spaces between content
        return index < arr.length - 1 ? children.concat(child, ' ') : children.concat(child);
      }, [])}
    </Text>
  );
}

function renderContent<T extends DataKeys, K = DataFile<T>>(content: Content<T>, data: K) {
  switch (content.type) {
    case 'metric':
      return <Metric data={data} {...content} />;
    case 'difference':
      return <Difference data={data} {...content} />;
    default:
      throw new Error(`Unknown content type`);
  }
}
