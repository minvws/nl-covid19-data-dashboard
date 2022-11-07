import { SeverityIndicatorTimelineEventConfig } from '~/components/severity-indicator-tile/components/timeline/timeline';

export function getTopicalStructureQuery(locale: string) {
  const query = `// groq
  {
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
'TopicalConfig': *[
        _type == 'topicalPageConfig'
      ]{
        ...,
'themes': themes[]->{...,
                    'tiles': tiles[]->{...}}
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

export type ElementsQueryResult = {
  thermometer: CmsThermometerElement[];
};

/**
 * Get the timeline configuration from the correct element and convert it to the
 * right format.
 */
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