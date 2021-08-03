import { MetricScope } from '@corona-dashboard/common';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';

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
        _type == 'timeSeries'
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
        _type == 'kpi'
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
  metricProperty: string | null;
  timelineEvents: CmsTimelineEventConfig[];
};

type CmsKpiElement = {
  _id: string;
  scope: MetricScope;
  metricName: string;
  metricProperty: string | null;
};

export type ElementsQueryResult = {
  timeSeries: CmsTimeSeriesElement[];
  kpi: CmsKpiElement[];
};

/**
 * Get the timeline configuration from the correct element and convert it to the
 * right format.
 */
export function getTimelineEvents(
  elements: CmsTimeSeriesElement[],
  metricName: string
) {
  const timelineEvents = elements.find(
    (x) => x.metricName === metricName
  )?.timelineEvents;

  return timelineEvents
    ? timelineEvents.map<TimelineEventConfig>((x) => ({
        title: x.title,
        description: x.description,
        start: new Date(x.date).getTime() / 1000,
        end: x.dateEnd ? new Date(x.dateEnd).getTime() / 1000 : undefined,
      }))
    : undefined;
}
