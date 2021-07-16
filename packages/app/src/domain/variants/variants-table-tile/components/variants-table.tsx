import { VariantRow } from '~/static-props/variants/get-variant-table-data';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { TableText } from '..';
import { NarrowVariantsTable } from './narrow-variants-table';
import { WideVariantsTable } from './wide-variants-table';

type VariantsTableProps = {
  rows: VariantRow[];
  text: TableText;
};

export function VariantsTable({ rows, text }: VariantsTableProps) {
  const breakpoints = useBreakpoints();

  return (
    <>
      {breakpoints.sm ? (
        <WideVariantsTable rows={rows} text={text} />
      ) : (
        <NarrowVariantsTable rows={rows} text={text} />
      )}
    </>
  );
}
