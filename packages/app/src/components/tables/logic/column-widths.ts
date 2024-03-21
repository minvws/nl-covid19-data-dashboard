import { TableColumnWidths, TableType } from '~/components/tables/types';

type ColumnWidths = Record<TableType, Record<string, TableColumnWidths>>;

const layout_302030: TableColumnWidths = {
  labelColumn: '30%',
  percentageColumn: '20%',
  percentageBarColumn: '30%',
};

const layout_352030: TableColumnWidths = {
  labelColumn: '35%',
  percentageColumn: '20%',
  percentageBarColumn: '30%',
};

const layout_102030: TableColumnWidths = {
  labelColumn: '10%',
  percentageColumn: '20%',
  percentageBarColumn: '30%',
};

export const columnWidths: ColumnWidths = {
  wide: {
    defaultWidth: layout_302030,
    behaviourTableTileWidth: layout_352030,
    autumn2022ShotCoverageAgeGroupWidth: layout_102030,
    primarySeriesCoveragePerAgeGroupWidth: layout_102030,
  },
  narrow: {},
};
