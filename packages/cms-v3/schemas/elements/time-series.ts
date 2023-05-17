import { DataScopeKey, MetricKeys, MetricName, ScopedData } from '@corona-dashboard/common';
import { snakeCase } from 'change-case';
import { BsFileEarmark } from 'react-icons/bs';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { isDefined } from 'ts-is-present';
import { getTitleForElementType, getTitleForMetricName } from '../../studio/utils';

export const timeSeries = defineType({
  name: 'timeSeries',
  type: 'document',
  title: 'Time Series',
  icon: BsFileEarmark,
  fields: [
    defineField({
      title: 'Scope',
      name: 'scope',
      type: 'string',
      readOnly: true,
      hidden: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Metric Name',
      name: 'metricName',
      type: 'string',
      readOnly: true,
      hidden: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Metric Property',
      name: 'metricProperty',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      title: 'Timeline Event Collections',
      name: 'timelineEventCollections',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'timelineEventCollection' }] })],
    }),
  ],
  preview: {
    select: {
      scope: 'scope',
      type: '_type',
      metricName: 'metricName',
      metricProperty: 'metricProperty',
    },
    prepare<K extends DataScopeKey>(x: { scope: K; type: string; metricName: MetricKeys<ScopedData[K]>; metricProperty?: string }) {
      const title = [getTitleForMetricName(x.metricName as MetricName), getTitleForElementType(x.type), x.metricProperty].filter(isDefined).join(' - ');
      const subtitle = [x.scope, x.metricName, snakeCase(x.type), x.metricProperty].filter(isDefined).join('.');
      return { title, subtitle };
    },
  },
});
