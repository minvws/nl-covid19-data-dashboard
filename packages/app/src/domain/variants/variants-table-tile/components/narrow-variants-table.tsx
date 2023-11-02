import { colors, DifferenceDecimal } from '@corona-dashboard/common';
import { useMemo } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { getMaximumNumberOfDecimals } from '~/utils/get-maximum-number-of-decimals';
import { useCollapsible } from '~/utils/use-collapsible';
import { Cell, HeaderCell, PercentageBarWithNumber, StyledTable, VariantDifference, VariantNameCell } from '.';
import { TableText } from '../types';
import { NoPercentageData } from './no-percentage-data';
import { VariantRow } from '~/domain/variants/data-selection/types';

interface NarrowVariantsTableProps {
  rows: VariantRow[];
  text: TableText;
}

export const NarrowVariantsTable = (props: NarrowVariantsTableProps) => {
  const intl = useIntl();
  const { rows, text } = props;
  const columnNames = text.kolommen;

  const formatValue = useMemo(() => {
    const numberOfDecimals = getMaximumNumberOfDecimals(rows.map((x) => x.percentage ?? 0));
    return (value: number) =>
      intl.formatPercentage(value, {
        minimumFractionDigits: numberOfDecimals,
        maximumFractionDigits: numberOfDecimals,
      });
  }, [intl, rows]);

  return (
    <StyledTable>
      <thead>
        <tr>
          <HeaderCell>{columnNames.variant_titel}</HeaderCell>
          <HeaderCell colSpan={2}>{columnNames.percentage}</HeaderCell>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <MobileVariantRow row={row} formatValue={formatValue} text={text} key={row.variantCode} />
        ))}
      </tbody>
    </StyledTable>
  );
};

interface MobileVariantRowProps {
  row: VariantRow;
  text: TableText;
  formatValue: (value: number) => string;
}

function MobileVariantRow(props: MobileVariantRowProps) {
  const { row, text, formatValue } = props;
  const collapsible = useCollapsible();

  const columnNames = text.kolommen;

  return (
    <>
      <tr style={{ cursor: 'pointer' }} onClick={collapsible.toggle}>
        <VariantNameCell variantCode={row.variantCode} text={text} mobile narrow />
        <Cell mobile>
          {isPresent(row.percentage) ? <PercentageBarWithNumber percentage={row.percentage} color={row.color} formatValue={formatValue} /> : <NoPercentageData text={text} />}
        </Cell>
        <Cell mobile alignRight>
          {collapsible.button()}
        </Cell>
      </tr>
      <tr>
        <MobileCell colSpan={3}>
          {collapsible.content(
            <Box spacing={2} paddingBottom={space[3]}>
              <Box display="flex" flexDirection="row" spacingHorizontal={2}>
                <InlineText>{columnNames.vorige_meting}:</InlineText>
                {isPresent(row.difference) && isPresent(row.difference.difference) && isPresent(row.difference.old_value) ? (
                  <VariantDifference value={row.difference as DifferenceDecimal} text={text} />
                ) : (
                  '-'
                )}
              </Box>
            </Box>
          )}
        </MobileCell>
      </tr>
    </>
  );
}

const MobileCell = styled.td`
  border-bottom: 1px solid ${colors.gray2};
`;
