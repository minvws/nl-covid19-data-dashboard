import { SeverityIndicatorTimelineEventConfig } from '~/components/severity-indicator-tile/components/timeline/timeline';
import { SeverityLevel } from '~/components/severity-indicator-tile/types';
import { ThermometerLevel, ThermometerTimelineEvent } from './query-types';

export function getTopicalStructureQuery(locale: string) {
  const query = `// groq
  {
    'topicalConfig': *[
        _type == 'topicalPageConfig' && !(_id in path('drafts.**'))
      ][0]{
        'title': title.${locale},
        'description': description.${locale}
    },
    'weeklySummary': *[
        _type == 'weeklySummary' && !(_id in path('drafts.**'))
      ][0]{
        'title': title.${locale},
        'items': items[]->{
          tileIcon,
          'description': description.${locale},
          isThermometerMetric
        },
      },
    'kpiThemes': *[
        _type == 'themeCollection' && !(_id in path('drafts.**'))
      ][0]{
        'themes': themes[]->{
          'title':title.${locale},
          themeIcon,
          'linksLabelMobile': labelMobile.${locale},
          'linksLabelDesktop': labelDesktop.${locale},
          'links':links[]->{
            'cta': {
              'title': cta.title.${locale},
              'href': cta.href
            },
          },
          'tiles':tiles[]->{
            'description':description.${locale},
            tileIcon,
            'title':title.${locale},
            'dateLabel':dateLabel.${locale},
            'sourceLabel':sourceLabel.${locale},
            'tileDate': tileDate.${locale},
            'kpiValue': kpiValue.${locale},
            'hideTrendIcon': hideTrendIcon,
            'trendIcon': {
              'color': trendIcon.color,
              'direction': trendIcon.direction,
              'intensity': trendIcon.intensity,
            },
            'cta': {
              'title': cta.title.${locale},
              'href': cta.href
            },
          },
        },
      },
    'advice': *[
      _type == 'advice' && !(_id in path('drafts.**'))
    ][0]{
      'title': title.${locale},
      'description': description.${locale},
      'links': links[]{
        'href': href,
        'title': title.${locale},
      },
      'image': {
        ...image,
        'altText': image.altText.${locale},
        'asset': {
          ...image.asset->,
        }
      }
    }
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
