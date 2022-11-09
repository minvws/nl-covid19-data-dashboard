import { ThermometerTimelineEvent } from './query-types';
import { SeverityIndicatorTimelineEventConfig } from '~/components/severity-indicator-tile/components/timeline/timeline';

export function getTopicalStructureQuery(locale: string) {
  const query = `// groq
    {
      'topicalConfig': *[
          _type == 'topicalPageConfig' && !(_id in path("drafts.**"))
      ][0]{
        'title': title.${locale},
        'description': description.${locale},
        'themes': themes[]->{
          "title":title.${locale},
          "subTitle":subTitle.${locale},
          themeIcon,
          'linksLabelMobile': labelMobile.${locale},
          'linksLabelDesktop': labelDesptop.${locale},

          "links":links[]->{
            'cta': {
              'title': cta.title.${locale},
              'href': cta.href
            },
          },
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
        _type == 'measureTheme' && !(_id in path("drafts.**"))
      ][0]{
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
          _type == 'thermometer' && !(_id in path("drafts.**"))
        ][0]{
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
          _type == 'thermometerTimeline' && !(_id in path("drafts.**"))
        ][0]{
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
    }`;

  return query;
}

export const getThermometerEvents = (thermometerEvents: ThermometerTimelineEvent[]) =>
  thermometerEvents.map<SeverityIndicatorTimelineEventConfig>((thermometerEvent) => ({
    title: thermometerEvent.title,
    description: thermometerEvent.description,
    level: thermometerEvent.level,
    start: new Date(thermometerEvent.date).getTime() / 1000,
    end: new Date(thermometerEvent.dateEnd).getTime() / 1000,
  }));
