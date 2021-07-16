import { Box } from '~/components/base';
import { TableText } from '~/domain/variants/variants-table-tile';
import { VariantRow } from '~/static-props/variants/get-variant-table-data';
import {
  Cell,
  HeaderCell,
  PercentageBarWithNumber,
  StyledTable,
  VariantDifference,
  VariantNameCell,
} from '.';

const columnKeys = ['variant_titel', 'percentage', 'vorige_meeting'] as const;

type WideVariantsTableProps = {
  rows: VariantRow[];
  text: TableText;
};

export function WideVariantsTable(props: WideVariantsTableProps) {
  const { rows, text } = props;

  const columnNames = text.kolommen;

  return (
    <StyledTable>
      <thead>
        <tr>
          {columnKeys.map((key) => (
            <HeaderCell key={key}>{columnNames[key]}</HeaderCell>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.variant}>
            <VariantNameCell
              variant={row.variant}
              text={text}
              countryOfOrigin={row.countryOfOrigin}
            />
            <Cell>
              <Box maxWidth="20em">
                <PercentageBarWithNumber
                  percentage={row.percentage}
                  color={row.color}
                />
              </Box>
            </Cell>
            <Cell>
              <VariantDifference value={row.difference} />
            </Cell>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
}
