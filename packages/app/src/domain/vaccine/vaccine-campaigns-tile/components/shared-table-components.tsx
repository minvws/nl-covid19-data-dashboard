import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';

export const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
  })
);

export const HeaderCell = styled.th<{ mobile?: boolean }>((x) =>
  css({
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
    px: 3,
    py: x.mobile ? 3 : 2,
    verticalAlign: 'top',
    width: !x.mobile ? '33%' : undefined,
  })
);

export const Cell = styled.td<{
  alignRight?: boolean;
  isOpen?: boolean;
  mobile?: boolean;
}>((x) =>
  css({
    float: x.alignRight ? 'right' : undefined,
    px: 3,
    py: x.mobile ? 2 : 4,
    verticalAlign: 'top',
    width: !x.mobile ? '33%' : undefined,
  })
);

export const Row = styled.tr<{
  isLast: boolean;
  isOpen?: boolean;
}>((x) =>
  css({
    background: x.isOpen ? colors.primaryOpacity : undefined,
    borderTop: '1px solid',
    borderBottom: x.isOpen || x.isLast ? '1px solid' : undefined,
    borderColor: x.isOpen ? colors.blue8 : colors.gray2,
    cursor: 'pointer',
  })
);
