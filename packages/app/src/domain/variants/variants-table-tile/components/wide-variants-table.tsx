import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { SiteText } from '~/locale';
import {
  Cell,
  HeaderCell,
  PercentageBarWithNumber,
  StyledTable,
  VariantDifference,
  VariantNameCell,
} from '.';
import { VariantRow } from '../logic/use-variants-table-data';

const columnKeys = [
  'variant_titel',
  'eerst_gevonden',
  'percentage',
  'vorige_meeting',
] as const;

type WideVariantsTableProps = {
  rows: VariantRow[];
  text: SiteText['covid_varianten'];
};

export function WideVariantsTable(props: WideVariantsTableProps) {
  const { rows, text } = props;

  const columnNames = text.varianten_tabel.kolommen;

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
            <VariantNameCell variant={row.variant} text={text} />
            <Cell>
              <InlineText>{row.countryOfOrigin}</InlineText>
            </Cell>
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
