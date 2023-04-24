import { DifferenceInteger } from '@corona-dashboard/common';

type TileData = {
  description: string;
  title: string;
  value: number | null;
  bar?: BarType;
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

export interface KpiContentProps {
  tile: TileData;
}

export type BarType = {
  value: number;
  color: string;
};
