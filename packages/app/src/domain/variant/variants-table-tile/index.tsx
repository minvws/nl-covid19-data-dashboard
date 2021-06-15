import { NationalDifference, NlVariantsValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineDifference } from '~/components/difference-indicator';
import { PercentageBar } from '~/components/percentage-bar';
import { Tile } from '~/components/tile';
import { Heading, InlineText, Text } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { useVariantsTableData } from './logic/use-variants-table-data';

type ColumnKeys =
  keyof SiteText['covid_varianten']['varianten_tabel']['kolommen'];

export function VariantsTableTile({
  data,
  differences,
}: {
  data: NlVariantsValue;
  differences: NationalDifference;
}) {
  const { siteText } = useIntl();

  const text = siteText.covid_varianten;
  const columnNames = text.varianten_tabel.kolommen;

  const sampleSize = data.sample_size;
  const variantsTableRows = useVariantsTableData(
    data,
    text.landen_van_herkomst,
    differences
  );

  const columnKeys: ColumnKeys[] = [
    'variant_titel',
    'eerst_gevonden',
    'aantal_monsters',
    'percentage',
    'vorige_meeting',
  ];

  return (
    <Tile>
      <Heading level={3}>{text.varianten_tabel.titel}</Heading>
      <Box maxWidth="maxWidthText">
        <Text>{text.varianten_tabel.omschrijving}</Text>
      </Box>

      {text.varianten_tabel.belangrijk_bericht && (
        <WarningTile
          message={text.varianten_tabel.belangrijk_bericht}
          variant="emphasis"
        />
      )}

      <Box overflow="auto" mb={3}>
        <StyledTable>
          <thead>
            <tr>
              {columnKeys.map((key) => (
                <HeaderCell key={key}>{columnNames[key]}</HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {variantsTableRows.map((row) => (
              <tr key={row.variant}>
                <Cell>
                  <InlineText fontWeight="bold">
                    {row.variant.charAt(0).toUpperCase()}
                    {row.variant.slice(1)}
                  </InlineText>
                </Cell>
                <Cell>
                  <InlineText>{row.countryOfOrigin}</InlineText>
                </Cell>
                <Cell>
                  <InlineText>
                    {row.occurrence}/{sampleSize}
                  </InlineText>
                </Cell>
                <Cell>
                  <PercentageBarWithNumber
                    percentage={row.percentage}
                    color={row.color}
                  />
                </Cell>
                <Cell>
                  <InlineDifference value={row.difference} />
                </Cell>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </Box>
    </Tile>
  );
}

const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
  })
);

const HeaderCell = styled.th(
  css({
    textAlign: 'left',
    borderBottom: '1px solid',
    borderBottomColor: 'lightGray',
  })
);

const Cell = styled.td(
  css({
    p: 0,
    py: 2,
  })
);

function PercentageBarWithNumber({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) {
  const { formatPercentage } = useIntl();
  return (
    <Box
      color={color}
      display="flex"
      alignItems="center"
      pr={{ _: 2, sm: 2, lg: 4, xl: 5 }}
    >
      <InlineText fontWeight="bold" color="black" pr={2}>
        {`${formatPercentage(percentage)}%`}
      </InlineText>
      <PercentageBar percentage={percentage} height="8px" />
    </Box>
  );
}
