import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { SiteText } from '~/locale';
import {
  Cell,
  HeaderCell,
  NumberOfSamples,
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
  'aantal_monsters',
] as const;

type DesktopVariantsTableProps = {
  rows: VariantRow[];
  text: SiteText['covid_varianten'];
};

export function DesktopVariantsTable(props: DesktopVariantsTableProps) {
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
              {row.difference && <VariantDifference value={row.difference} />}
            </Cell>
            <Cell>
              <NumberOfSamples
                occurrence={row.occurrence}
                sampleSize={row.sampleSize}
              />
            </Cell>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
}
