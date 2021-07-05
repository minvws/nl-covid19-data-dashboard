import { MetricScope } from '@corona-dashboard/common';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';

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

/**
 * @TODO move these CMS type definitions to a more generic location
 */
export type CmsTimelineEventConfig = {
  title: string;
  description: string;
  date: string;
  dateEnd: string;
};

export type CmsTimeSeriesElement = {
  _id: string;
  scope: MetricScope;
  metricName: string;
  metricProperty: string | null;
  timelineEvents: CmsTimelineEventConfig[];
};

export type CmsKpiElement = {
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
): TimelineEventConfig[] | undefined {
  const timelineEvents = elements.find(
    (x) => x.metricName === metricName
  )?.timelineEvents;

  return timelineEvents
    ? timelineEvents.map(
        (x) =>
          ({
            title: x.title,
            description: x.description,
            start: new Date(x.date).getTime() / 1000,
            end: x.dateEnd ? new Date(x.dateEnd).getTime() / 1000 : undefined,
          } as TimelineEventConfig)
      )
    : undefined;
}
