import { DifferenceInteger } from '@corona-dashboard/common';

export type TileData = {
  dateOrRange?: number | DateRange;
  dateOfInsertion?: number;
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
  timeframePeriod?: number | DateRange;
  isTimeframePeriodKpi?: boolean;
  dateOfInsertion?: number;
  isArchived?: boolean;
  description: string;
  source?: {
    href: string;
    text: string;
  };
  tilesData: [TileData, TileData];
  title: string;
  disclaimer?: string;
}

type BarType = {
  value: number;
  color: string;
};
