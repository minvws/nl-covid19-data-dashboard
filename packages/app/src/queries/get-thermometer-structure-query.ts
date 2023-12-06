import { SeverityIndicatorTimelineEventConfig } from '~/components/severity-indicator-tile/components/timeline/timeline';
import { SeverityLevel } from '~/components/severity-indicator-tile/types';
import { ThermometerLevel, ThermometerTimelineEvent } from './query-types';

export function getThermometerStructureQuery(locale: string) {
  const query = `// groq
  *[_type == 'coronaThermometer' && !(_id in path('drafts.**'))][0]
  {
    icon,
    'title': title.${locale},
    'tileTitle':tileTitle.${locale},
    currentLevel,
    'thermometerLevels': thermometerLevels[]->{
      'level': level,
      'label': label.${locale},
      'description': description.${locale},
    },
    'datesLabel': datesLabel.${locale},
    'levelDescription': levelDescription.${locale},
    'sourceLabel': sourceLabel.${locale},
    'articleReference': articleReference.${locale},
    'collapsibleTitle': collapsibleTitle.${locale},
    'timeline': {
      'title': timeline.title.${locale},
      'tooltipLabel': timeline.tooltipCurrentEstimationLabel.${locale},
      'todayLabel': timeline.todayLabel.${locale},
      'legendLabel': timeline.legendLabel.${locale},
      'ThermometerTimelineEvents': timeline.thermometerTimelineEvents[]->{
        'title': title.${locale},
        'description': description.${locale},
        level,
        date,
        dateEnd
      },
    },
  }`;
  return query;
}

export const getThermometerEvents = (thermometerEvents: ThermometerTimelineEvent[], thermometerLevels: ThermometerLevel[]) =>
  thermometerEvents.map<SeverityIndicatorTimelineEventConfig>((thermometerEvent) => {
    const levelDetails = thermometerLevels.find((thermometerLevel) => thermometerLevel.level === (thermometerEvent.level as SeverityLevel)) as ThermometerLevel;

    return {
      title: levelDetails.label,
      description: levelDetails.description,
      level: levelDetails.level,
      start: new Date(thermometerEvent.date).getTime() / 1000,
      end: new Date(thermometerEvent.dateEnd).getTime() / 1000,
    };
  });
