import { ThermometerEvent } from './query-types';
import { SeverityIndicatorTimelineEventConfig } from '~/components/severity-indicator-tile/components/timeline/timeline';

export function getTopicalStructureQuery(locale: string) {
  const query = `// groq
  {
    'TopicalConfig': *[
        _type == 'topicalPageConfig'
    ]{
      'title': title.${locale},
      'description': description.${locale},
      'themes': themes[]->{
        "title":title.${locale},
        "subTitle":subTitle.${locale},
        tileIcon,
        "tiles":tiles[]->{
          "description":description.${locale},
          tileIcon,
          "title":title.${locale},
          'kpiValue': kpiValue.${locale},
          'trendIcon': {
            'color': trendIcon.color,
            'direction': trendIcon.direction,
          },
          'cta': {
            'title': cta.title.${locale},
            'href': cta.href
          },
        },
      },
    },
    'measureTheme': *[
      _type == 'measureTheme'
    ]{
      'title': title.${locale},
      tileIcon,
      'subTitle': subTitle.${locale},
      'tiles': tiles[]->{
        tileIcon,
        'description': description.${locale}
      },
    },
    'thermometer': {
      'config': *[
        _type == 'thermometer'
      ]{
        'title': title.${locale},
        currentLevel,
        'thermometerLevels': thermometerLevels[]->{
          'level': level,
          'label': label.${locale},
          'title': title.${locale},
          'description': description.${locale},
        },
        'datesLabel': datesLabel.${locale},
        'levelDescription': levelDescription.${locale},
        'sourceLabel': sourceLabel.${locale},
        'articleReference': articleReference.${locale},
        'collapsibleTitle': collapsibleTitle.${locale},
        'trendIcon': {
          'color': trendIcon.color,
          'direction': trendIcon.direction,
        },
      },
      'timeline': *[
        _type == 'thermometerTimeline'
      ]{
        'title': title.${locale},
        'tooltipLabel': tooltipCurrentEstimationLabel.${locale},
        'todayLabel': todayLabel.${locale},
        'legendLabel': legendLabel.${locale},
        'ThermometerEvents': thermometerTimelineEvents[]->{
          'title': title.${locale},
          'description': description.${locale},
          level,
          date,
          dateEnd
        },
      },
    }
  }
  `;

  return query;
}

export const getThermometerEvents = (thermometerEvents: ThermometerEvent[]) =>
  thermometerEvents.map<SeverityIndicatorTimelineEventConfig>((thermometerEvent) => ({
    title: thermometerEvent.title,
    description: thermometerEvent.description,
    level: thermometerEvent.level,
    start: new Date(thermometerEvent.date).getTime() / 1000,
    end: new Date(thermometerEvent.dateEnd).getTime() / 1000,
  }));
