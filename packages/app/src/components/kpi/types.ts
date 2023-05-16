import { DifferenceInteger } from '@corona-dashboard/common';

export type TileData = {
  description: string;
  title: string;
  value: number | null;
  bar?: BarType;
  isPercentage?: boolean;
  birthyear?: string | null;
  differenceValue?: DifferenceInteger;
};

export interface BorderedKpiSectionProps {
  dateUnix: number;
  description: string;
  source: {
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
