import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { SiteText } from '~/locale';
import {
  Cell,
  HeaderCell,
  PercentageBarWithNumber,
  Samples,
  StyledTable,
  VariantCell,
  VariantDiff,
} from '.';
import { VariantRow } from '../logic/use-variants-table-data';

type ColumnKeys =
  keyof SiteText['covid_varianten']['varianten_tabel']['kolommen'];

const columnKeys: ColumnKeys[] = ['variant_titel', 'percentage'];

type MobileVariantsTableProps = {
  rows: VariantRow[];
  text: SiteText['covid_varianten'];
};

export function MobileVariantsTable(props: MobileVariantsTableProps) {
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
          <>
            <tr key={row.variant}>
              <VariantCell variant={row.variant} text={text} compact />
              <Cell>
                <PercentageBarWithNumber
                  percentage={row.percentage}
                  color={row.color}
                />
              </Cell>
            </tr>
            <tr>
              <Cell colSpan={2} border>
                <Box mb={1}>
                  {columnNames['aantal_monsters']}:{' '}
                  <Samples
                    occurrence={row.occurrence}
                    sampleSize={row.sampleSize}
                  />
                </Box>
                <Box mb={1}>
                  {columnNames['vorige_meeting']}:{' '}
                  {row.difference && <VariantDiff value={row.difference} />}
                </Box>
                <Box mb={1}>
                  {columnNames['eerst_gevonden']}:{' '}
                  <InlineText>{row.countryOfOrigin}</InlineText>
                </Box>
              </Cell>
            </tr>
          </>
        ))}
      </tbody>
    </StyledTable>
  );
}
