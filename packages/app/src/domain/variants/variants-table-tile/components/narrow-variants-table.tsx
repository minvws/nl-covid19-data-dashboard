import { DifferenceDecimal } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useMemo } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { InlineText, Text } from '~/components/typography';
import { VariantRow } from '~/domain/variants/static-props';
import { useIntl } from '~/intl';
import { getMaximumNumberOfDecimals } from '~/utils/get-maximum-number-of-decimals';
import { useCollapsible } from '~/utils/use-collapsible';
import {
  Cell,
  HeaderCell,
  PercentageBarWithNumber,
  StyledTable,
  VariantDifference,
  VariantNameCell,
} from '.';
import { useVariantNameAndDescription } from '../logic/use-variant-name-and-description';
import { TableText } from '../types';
import { NoPercentageData } from './no-percentage-data';

type NarrowVariantsTableProps = {
  rows: VariantRow[];
  text: TableText;
};

export function NarrowVariantsTable(props: NarrowVariantsTableProps) {
  const intl = useIntl();
  const { rows, text } = props;
  const columnNames = text.kolommen;

  const formatValue = useMemo(() => {
    const numberOfDecimals = getMaximumNumberOfDecimals(
      rows.map((x) => x.percentage ?? 0)
    );
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
          <MobileVariantRow
            row={row}
            formatValue={formatValue}
            text={text}
            key={row.variant}
          />
        ))}
      </tbody>
    </StyledTable>
  );
}

type MobileVariantRowProps = {
  row: VariantRow;
  text: TableText;
  formatValue: (value: number) => string;
};

function MobileVariantRow(props: MobileVariantRowProps) {
  const { row, text, formatValue } = props;
  const collapsible = useCollapsible();

  const columnNames = text.kolommen;

  const [, variantDescription] = useVariantNameAndDescription(
    row.variant,
    text.anderen_tooltip
  );

  return (
    <>
      <tr style={{ cursor: 'pointer' }} onClick={collapsible.toggle}>
        <VariantNameCell variant={row.variant} text={text} mobile narrow />
        <Cell mobile>
          {isPresent(row.percentage) ? (
            <PercentageBarWithNumber
              percentage={row.percentage}
              color={row.color}
              formatValue={formatValue}
            />
          ) : (
            <NoPercentageData />
          )}
        </Cell>
        <Cell mobile alignRight>
          {collapsible.button()}
        </Cell>
      </tr>
      <tr>
        <MobileCell colSpan={3}>
          {collapsible.content(
            <Box spacing={2} css={css({ pb: 3 })}>
              <Box display="flex" flexDirection="row" spacingHorizontal={2}>
                <InlineText>{columnNames.vorige_meting}:</InlineText>
                {isPresent(row.difference) &&
                isPresent(row.difference.difference) &&
                isPresent(row.difference.old_value) ? (
                  <VariantDifference
                    value={row.difference as DifferenceDecimal}
                  />
                ) : (
                  '-'
                )}
              </Box>
              <Text color="annotation">{variantDescription}</Text>
            </Box>
          )}
        </MobileCell>
      </tr>
    </>
  );
}

const MobileCell = styled.td(
  css({
    borderBottom: '1px solid',
    borderBottomColor: 'lightGray',
  })
);
