import { MetricScope } from '@corona-dashboard/common';

const NO_DRAFTS = `!(_id in path('drafts.**'))`;

function formatStringArray(array: string[]) {
  return `[${array.map((x) => `'${x}'`).join(',')}]`;
}

export function createElementsQuery(
  scope: MetricScope,
  metricNames: string[],
  locale: string
) {
  const query = `// groq
    {
      'timeSeries': *[
        ${NO_DRAFTS}
        && _type == 'timeSeries'
        && scope == '${scope}'
        && metricName in ${formatStringArray(metricNames)}
      ]{
        _id,
        metricName,
        metricProperty,
        timelineEvents[]{
          'title': title.${locale},
          'description': description.${locale},
          date,
          dateEnd
        }
      },
      'kpi': *[
        ${NO_DRAFTS}
        && _type == 'kpi'
        && scope == '${scope}'
        && metricName in ${formatStringArray(metricNames)}
      ]{
        _id,
        metricName,
        metricProperty
      }
    }
  `;

  return query;
}

type CmsTimelineEventConfig = {
  title: string;
  description: string;
  date: string;
  dateEnd: string;
};

type CmsTimeSeriesElement = {
  _id: string;
  scope: MetricScope;
  metricName: string;
  metricProperty?: string;
  timelineEvents: CmsTimelineEventConfig[];
};

type CmsKpiElement = {
  _id: string;
  scope: MetricScope;
  metricName: string;
  metricProperty?: string;
};

export type ElementsQueryResult = {
  timeSeries?: CmsTimeSeriesElement[];
  kpi?: CmsKpiElement[];
};
