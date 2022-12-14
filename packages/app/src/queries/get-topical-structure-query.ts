import { ThermometerLevel, ThermometerTimelineEvent } from './query-types';
import { SeverityIndicatorTimelineEventConfig } from '~/components/severity-indicator-tile/components/timeline/timeline';
import { SeverityLevel } from '~/components/severity-indicator-tile/types';

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
          'subTitle':subTitle.${locale},
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
            'sourceLabel':sourceLabel.${locale},
            'kpiValue': kpiValue.${locale},
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
      'measureTheme': *[
        _type == 'measureTheme' && !(_id in path('drafts.**'))
      ][0]{
        'title': title.${locale},
        themeIcon,
        'subTitle': subTitle.${locale},
        'tiles': tiles[]->{
          tileIcon,
          'description': description.${locale}
        },
      },
      'thermometer': *[
        _type == 'thermometer' && !(_id in path('drafts.**'))
      ][0]{
        icon,
        'title': title.${locale},
        'subTitle': subTitle.${locale},
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
        'trendIcon': {
          'color': trendIcon.color,
          'direction': trendIcon.direction,
        },
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
    }
  }`;

  return query;
}

export const getThermometerEvents = (thermometerEvents: ThermometerTimelineEvent[], thermometerLevels: ThermometerLevel[]) => {
  // 1. USE thermometerEvent.level TO FIND level IN thermometerLevels
  // 2. USE level TO REFERENCE level.title AND level.description

  return thermometerEvents.map<SeverityIndicatorTimelineEventConfig>((thermometerEvent) => {
    // STEP 1 GOES HERE
    const currentLevel = thermometerLevels?.find((thermometerLevel) => thermometerLevel.level === (thermometerEvent.level as SeverityLevel));

    return {
      title: currentLevel?.label ?? thermometerEvent.title, // STEP 2.1 - title
      description: currentLevel?.description ?? thermometerEvent.description, // STEP 2.2 - description
      level: thermometerEvent.level,
      start: new Date(thermometerEvent.date).getTime() / 1000,
      end: new Date(thermometerEvent.dateEnd).getTime() / 1000,
    };
  });
};
