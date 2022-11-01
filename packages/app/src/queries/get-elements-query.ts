import { DataScopeKey, MetricName } from '@corona-dashboard/common';
import { SeverityIndicatorTimelineEventConfig } from '~/components/severity-indicator-tile/components/timeline/timeline';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';

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
      'thermometer': *[
        _type == 'thermometerEventCollection'
      ]{
        _id,
        name,
        thermometerEvents[]{
          'title': title.${locale},
          'description': description.${locale},
          'level': level,
          date,
          dateEnd
        }
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

type CmsTimelineEventConfig = {
  title: string;
  description: string;
  date: string;
  dateEnd: string;
};

type CmsTimeSeriesElement = {
  _id: string;
  scope: DataScopeKey;
  metricName: string;
  metricProperty: string | null;
  timelineEventCollections: CmsTimelineEventCollection[];
  warning: string | null;
};

type CmsTimelineEventCollection = {
  timelineEvents: CmsTimelineEventConfig[];
};

type CmsThermometerEventConfig = CmsTimelineEventConfig & {
  start: number;
  end: number;
  level: number;
};

type CmsThermometerElement = {
  _id: string;
  name: string;
  thermometerEvents: CmsThermometerEventConfig[];
};

type CmsKpiElement = ElementBase;

type CmsChoroplethElement = ElementBase;

type CmsWarningElement = {
  warning: string;
} & ElementBase;

export type ElementsQueryResult = {
  timeSeries: CmsTimeSeriesElement[];
  thermometer: CmsThermometerElement[];
  kpi: CmsKpiElement[];
  choropleth: CmsChoroplethElement[];
  warning: CmsWarningElement[];
};

/**
 * Get the timeline configuration from the correct element and convert it to the
 * right format.
 */
export function getTimelineEvents(elements: CmsTimeSeriesElement[], metricName: MetricName, metricProperty?: string) {
  const timelineEventCollections = elements.find((x) => x.metricName === metricName && (!metricProperty || x.metricProperty === metricProperty))?.timelineEventCollections;

  return timelineEventCollections
    ? timelineEventCollections.flatMap<TimelineEventConfig>((collection) =>
        collection.timelineEvents.map((x) => ({
          title: x.title,
          description: x.description,
          start: new Date(x.date).getTime() / 1000,
          end: x.dateEnd ? new Date(x.dateEnd).getTime() / 1000 : undefined,
        }))
      )
    : undefined;
}

export const getThermometerEvents = (elements: CmsThermometerElement[], name: string) => {
  const thermometerEvents = elements.find((element) => element.name === name)?.thermometerEvents;

  return thermometerEvents
    ? thermometerEvents.map<SeverityIndicatorTimelineEventConfig>((thermometerEvent) => ({
        title: thermometerEvent.title,
        description: thermometerEvent.description,
        level: thermometerEvent.level,
        start: new Date(thermometerEvent.date).getTime() / 1000,
        end: new Date(thermometerEvent.dateEnd).getTime() / 1000,
      }))
    : undefined;
};

export function getWarning(elements: CmsWarningElement[], metricName: MetricName) {
  return elements.find((x) => x.metricName === metricName)?.warning || undefined;
}
