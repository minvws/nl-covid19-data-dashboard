import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import {
  Cell,
  HeaderCell,
  PercentageBarWithNumber,
  StyledTable,
  VariantDiff,
} from '.';
import { VariantRow } from '../logic/use-variants-table-data';
import { Samples } from './samples';
import { VariantCell } from './variant-cell';

type ColumnKeys =
  keyof SiteText['covid_varianten']['varianten_tabel']['kolommen'];

const columnKeys: ColumnKeys[] = [
  'variant_titel',
  'eerst_gevonden',
  'aantal_monsters',
  'percentage',
  'vorige_meeting',
];

type DesktopVariantsTableProps = {
  rows: VariantRow[];
  text: SiteText['covid_varianten'];
};

export function DesktopVariantsTable(props: DesktopVariantsTableProps) {
  const { rows, text } = props;
  const { formatNumber } = useIntl();

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
              <Samples
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
