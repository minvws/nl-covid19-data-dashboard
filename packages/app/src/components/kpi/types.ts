import { DifferenceInteger } from '@corona-dashboard/common';
import { BarType } from '~/pages/landelijk/vaccinaties';

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

export interface MappedKpiContentProps {
  tile: TileData;
}
