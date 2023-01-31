import { TrendIcon } from '@corona-dashboard/app/src/domain/topical/types';
import { SeverityLevel } from '~/components/severity-indicator-tile/types';
import { IconName as TopicalIcon } from '@corona-dashboard/icons/src/icon-name2filename';
import { PortableTextEntry } from '@sanity/block-content-to-react';

export interface TopicalSanityData {
  topicalConfig: TopicalConfig;
  weeklySummary: WeeklySummary;
  kpiThemes: KpiThemes;
  measureTheme: MeasureTheme;
  thermometer: ThermometerConfig;
}

interface ThermometerConfig {
  icon: TopicalIcon;
  title: string;
  subTitle: PortableTextEntry[] | null;
  tileTitle: string | null;
  currentLevel: SeverityLevel;
  datesLabel: string;
  levelDescription: string;
  sourceLabel: string;
  articleReference: PortableTextEntry[];
  collapsibleTitle: string;
  trendIcon: TrendIcon;
  thermometerLevels: ThermometerLevel[];
  timeline: ThermometerTimeLine;
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

export interface ThermometerLevel {
  level: SeverityLevel;
  label: string;
  description: string;
}

interface TopicalConfig {
  title: string;
  description: PortableTextEntry[];
}

interface KpiThemes {
  themes: TopicalTheme[];
}
interface Theme {
  title: string;
  subTitle: PortableTextEntry[] | null;
  themeIcon: TopicalIcon;
}

interface WeeklySummary extends Theme {
  items: BaseTile[];
}
interface MeasureTheme extends Theme {
  tiles: BaseTile[];
}

interface TopicalTheme extends Theme {
  tiles: TopicalTile[];
  linksLabelDesktop: string | null;
  linksLabelMobile: string | null;
  links: ThemeLink[] | null;
}

export interface BaseTile {
  tileIcon: TopicalIcon;
  description: PortableTextEntry[];
  isThermometerMetric?: boolean;
}

interface TopicalTile extends BaseTile {
  title: string;
  sourceLabel: string | null;
  kpiValue: string | null;
  cta: Cta;
  trendIcon: TrendIcon;
}

export interface ThemeLink {
  cta: Cta;
}

export interface Cta {
  title: string | null;
  href: string | null;
}
