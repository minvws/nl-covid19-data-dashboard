import { TrendIcon } from '@corona-dashboard/app/src/domain/topical/types';
import { SeverityLevel } from '~/components/severity-indicator-tile/types';
import { IconName as TopicalIcon } from '@corona-dashboard/icons/src/icon-name2filename';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import { ImageBlock, LinkProps } from '~/types/cms';

export interface TopicalSanityData {
  topicalConfig: TopicalConfig;
  weeklySummary: WeeklySummary;
  kpiThemes: KpiThemes;
  thermometer: ThermometerConfig;
  advice: Advice;
}

export interface ThermometerConfig {
  icon: TopicalIcon;
  title: string;
  tileTitle: string | null;
  currentLevel: SeverityLevel;
  datesLabel: string;
  levelDescription: string;
  sourceLabel: string;
  articleReference: PortableTextEntry[];
  collapsibleTitle: string;
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
  themeIcon: TopicalIcon;
}

interface WeeklySummary extends Theme {
  items: BaseTile[];
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
  dateLabel?: string;
  sourceLabel?: string;
  tileDate: string;
  kpiValue: string | null;
  cta: Cta;
  hideTrendIcon: boolean;
  trendIcon: TrendIcon;
}

export interface ThemeLink {
  cta: Cta;
}

export interface Cta {
  title: string | null;
  href: string | null;
}

export interface Advice {
  title: string;
  description: PortableTextEntry[];
  links: LinkProps[];
  image: ImageBlock;
}
