import { InlineText } from '~/components/typography';
import { SiteText } from '~/locale';
import {
  Cell,
  HeaderCell,
  PercentageBarWithNumber,
  StyledTable,
  VariantDiff,
} from '.';
import { VariantRow } from '../logic/use-variants-table-data';
import { NumberOfSamples } from './number-of-samples';
import { VariantCell } from './variant-cell';

const columnKeys = [
  'variant_titel',
  'eerst_gevonden',
  'aantal_monsters',
  'percentage',
  'vorige_meeting',
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
            <VariantCell variant={row.variant} text={text} />
            <Cell>
              <InlineText>{row.countryOfOrigin}</InlineText>
            </Cell>
            <Cell>
              <NumberOfSamples
                occurrence={row.occurrence}
                sampleSize={row.sampleSize}
              />
            </Cell>
            <Cell>
              <PercentageBarWithNumber
                percentage={row.percentage}
                color={row.color}
              />
            </Cell>
            <Cell>
              {row.difference && <VariantDiff value={row.difference} />}
            </Cell>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
}
