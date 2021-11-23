import css from '@styled-system/css';
import styled from 'styled-components/';

/**
 * This divider is exclusively used (for now) to separate a page information block
 * on a metric page when it's not the first one.
 *
 * Because of the way the spacing of the tileList is setup we need a border,
 * top margin and bottom padding to add the correct spacing.
 */

export const Divider = styled.div(
  css({
    width: '100%',
    borderTop: 'solid 2px lightGray',
    mt: 2,
    py: 2,
  })
);
