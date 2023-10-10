import { DifferenceInteger } from '@corona-dashboard/common';

export type TileData = {
  dateOrRange?: number | DateRange;
  source?: {
    href: string;
    text: string;
  };
  description: string;
  title: string;
  value: number | null;
  bar?: BarType;
  isPercentage?: boolean;
  birthyear?: string | null;
  differenceValue?: DifferenceInteger;
};

interface DateRange {
  start: number;
  end: number;
}

export interface BorderedKpiSectionProps {
  dateOrRange?: number | DateRange;
  description: string;
  source?: {
    href: string;
    text: string;
  };
  tilesData: [TileData, TileData];
  title: string;
}

type BarType = {
  value: number;
  color: string;
};
