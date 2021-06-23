import css from '@styled-system/css';
import styled from 'styled-components';

export const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
  })
);

export const HeaderCell = styled.th(
  css({
    textAlign: 'left',
    fontWeight: 'normal',
    borderBottom: '1px solid',
    borderBottomColor: 'lightGray',
    verticalAlign: 'top',
  })
);

export const Cell = styled.td<{
  compact?: boolean;
  border?: boolean;
  alignRight?: boolean;
}>((x) =>
  css({
    p: 0,
    py: 2,
    float: x.alignRight ? 'right' : undefined,
    maxWidth: x.compact ? '2rem' : undefined,
    borderBottom: x.border ? '1px solid' : undefined,
    borderBottomColor: x.border ? 'lightGray' : undefined,
    verticalAlign: 'top',
  })
);
