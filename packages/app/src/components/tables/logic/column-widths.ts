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

export const columnWidths: ColumnWidths = {
  wide: {
    default: layout_302030,
    behaviourTableTile: layout_352030,
  },
  narrow: {},
};
