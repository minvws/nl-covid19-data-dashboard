import { DataScopeKey, MetricName } from '@corona-dashboard/common';

function formatStringArray(array: string[]) {
  return `[${array.map((x) => `'${x}'`).join(',')}]`;
}

export function getElementsQuery<K extends DataScopeKey>(scope: K, metricNames: MetricName[], locale: string) {
  const query = `// groq
    {
      'timeSeries': *[
        _type == 'timeSeries'
        && scope == '${scope}'
        && metricName in ${formatStringArray(metricNames as string[])}
      ]{
        _id,
        metricName,
        metricProperty,
        timelineEventCollections[]->{timelineEvents[]{
          'title': title.${locale},
          'description': description.${locale},
          date,
          dateEnd
        }},
        warning
      },
      'kpi': *[
        _type == 'kpi'
        && scope == '${scope}'
        && metricName in ${formatStringArray(metricNames as string[])}
      ]{
        _id,
        metricName,
        metricProperty
      },
      'warning': *[
        _type == 'warning'
        && scope == '${scope}'
        && metricName in ${formatStringArray(metricNames as string[])}
      ]{
        _id,
        metricName,
        metricProperty,
        warning
      },
      'choropleth': *[
        _type == 'choropleth'
        && scope == '${scope}'
        && metricName in ${formatStringArray(metricNames as string[])}
      ]{
        _id,
        metricName,
        metricProperty
      }
    }
  `;

  return query;
}

type ElementBase = {
  _id: string;
  scope: DataScopeKey;
  metricName: string;
  metricProperty: string | null;
};

type CmsTimeSeriesElement = {
  _id: string;
  scope: DataScopeKey;
  metricName: string;
  metricProperty: string | null;
  warning: string | null;
};

type CmsKpiElement = ElementBase;

type CmsChoroplethElement = ElementBase;

type CmsWarningElement = {
  warning: string;
} & ElementBase;

export type ElementsQueryResult = {
  timeSeries: CmsTimeSeriesElement[];
  kpi: CmsKpiElement[];
  choropleth: CmsChoroplethElement[];
  warning: CmsWarningElement[];
};

/**
 * Get the timeline configuration from the correct element and convert it to the
 * right format.
 */
export function getWarning(elements: CmsWarningElement[], metricName: MetricName) {
  return elements.find((x) => x.metricName === metricName)?.warning || undefined;
}
