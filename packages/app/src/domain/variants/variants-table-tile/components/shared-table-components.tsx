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
  mobile?: boolean;
  narrow?: boolean;
  border?: boolean;
  alignRight?: boolean;
}>((x) =>
  css({
    p: 0,
    py: 3,
    float: x.alignRight ? 'right' : undefined,
    maxWidth: x.narrow ? '2rem' : undefined,
    borderBottom: x.border || !x.mobile ? '1px solid' : undefined,
    borderBottomColor: x.border || !x.mobile ? 'lightGray' : undefined,
    verticalAlign: 'top',
  })
);
