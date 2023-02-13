import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components/';
import { space } from '~/style/theme';

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
    borderTop: `solid 2px ${colors.gray2}`,
    marginTop: space[2],
    paddingY: space[2],
  })
);
