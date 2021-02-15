import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import { space, SpaceProps } from 'styled-system';
import { StyledShouldForwardProp } from '~/utils/styledShouldForwardProp';

type TopicalTileProps = SpaceProps;

export const TopicalTile = styled.article.withConfig({
  shouldForwardProp: StyledShouldForwardProp,
})<TopicalTileProps>(
  css({
    display: 'flex',
    flexDirection: 'column',
    bg: 'tileGray',
    p: 4,
    mx: asResponsiveArray({ _: -3, md: 0 }),
    mb: 0,
    borderRadius: 1,
  }),
  space
);
