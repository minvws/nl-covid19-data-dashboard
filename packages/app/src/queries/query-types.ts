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
  ThermometerEvents: ThermometerEvent[];
}

export interface ThermometerEvent {
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
  description: string;
}

interface TopicalConfig {
  title: string;
  description: string;
  themes: TopicalTheme[];
}

interface Theme {
  title: string;
  themeIcon: TopicalIcon;
  subTitle: string;
}

interface MeasureTheme extends Theme {
  tiles: BaseTile[];
}

interface TopicalTheme extends Theme {
  tiles: TopicalTile[];
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

export interface Cta {
  title: string;
  href: string;
}
