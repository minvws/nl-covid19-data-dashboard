import { TrendIcon } from '@corona-dashboard/app/src/domain/topical/types';
import { SeverityLevel } from '~/components/severity-indicator-tile/types';
import { TopicalIcon } from '@corona-dashboard/common/src/types';

export interface TopicalSanityData {
  topicalConfig: TopicalConfig;
  measureTheme: MeasureTheme;
  thermometer: Thermometer;
}

interface Thermometer {
  config: ThermometerConfig;
  timeline: ThermometerTimeLine;
}

interface ThermometerConfig {
  title: string;
  currentLevel: SeverityLevel;
  datesLabel: string;
  levelDescription: string;
  sourceLabel: string;
  articleReference: string;
  collapsibleTitle: string;
  trendIcon: TrendIcon;
  thermometerLevels: ThermometerLevel[];
}

interface ThermometerTimeLine {
  title: string;
  tooltipLabel: string;
  todayLabel: string;
  legendLabel: string;
  ThermometerTimelineEvents: ThermometerTimelineEvent[];
}

export interface ThermometerTimelineEvent {
  title: string;
  description: string;
  level: number;
  date: number;
  dateEnd: number;
}

interface ThermometerLevel {
  level: SeverityLevel;
  label: string;
  title: string;
  description: string | null;
}

interface TopicalConfig {
  title: string;
  description: string;
  themes: TopicalTheme[];
}

interface Theme {
  title: string;
  subTitle: string | null;
  themeIcon: TopicalIcon;
}

interface MeasureTheme extends Theme {
  tiles: BaseTile[];
}

interface TopicalTheme extends Theme {
  tiles: TopicalTile[];
  linksLabel: string | null;
  links: ThemeLink[] | null;
}

interface BaseTile {
  tileIcon: TopicalIcon;
  description: string;
}

interface TopicalTile extends BaseTile {
  title: string;
  kpiValue: string;
  cta: Cta;
  trendIcon: TrendIcon;
}

interface ThemeLink {
  cta: Cta;
}

export interface Cta {
  title: string;
  href: string;
}
